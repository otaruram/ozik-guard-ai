package service

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"ozikcarbon-backend/internal/repository"
	"ozikcarbon-backend/prisma/db"
)

type RegulasiSearchResult struct {
	ID           string  `json:"id"`
	RegName      string  `json:"regName"`
	Article      string  `json:"article"`
	Content      string  `json:"content"`
	RiskCategory string  `json:"riskCategory"`
	Similarity   float64 `json:"similarity"`
}

type RegulasiSearchResponse struct {
	AiSummary string                 `json:"aiSummary"`
	Results   []RegulasiSearchResult `json:"results"`
}

type RegulasiService interface {
	Search(ctx context.Context, query string) (*RegulasiSearchResponse, error)
	GetRecommendations(ctx context.Context, userID string) ([]RegulasiSearchResult, error)
}

type regulasiService struct {
	dbClient   *db.PrismaClient
	auditRepo  repository.AuditRepository
	sumopodURL string
	sumopodKey string
	httpClient *http.Client

	cacheMutex  sync.RWMutex
	searchCache map[string]*RegulasiSearchResponse
}

func NewRegulasiService(dbClient *db.PrismaClient, auditRepo repository.AuditRepository, sumopodURL, sumopodKey string) RegulasiService {
	return &regulasiService{
		dbClient:    dbClient,
		auditRepo:   auditRepo,
		sumopodURL:  sumopodURL,
		sumopodKey:  sumopodKey,
		httpClient:  &http.Client{Timeout: 60 * time.Second},
		searchCache: make(map[string]*RegulasiSearchResponse),
	}
}

func (s *regulasiService) getEmbedding(ctx context.Context, text string) ([]float64, error) {
	if s.sumopodURL == "" || s.sumopodKey == "" {
		return nil, fmt.Errorf("SUMOPOD_URL or SUMOPOD_API_KEY is missing")
	}

	sumopodURL := strings.TrimSuffix(s.sumopodURL, "/")
	var endpoint string
	if strings.HasSuffix(sumopodURL, "/v1") {
		endpoint = sumopodURL + "/embeddings"
	} else {
		endpoint = sumopodURL + "/v1/embeddings"
	}

	reqBody, _ := json.Marshal(map[string]interface{}{
		"model": "text-embedding-3-small",
		"input": text,
	})

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.sumopodKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("embedding API failed with status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var result struct {
		Data []struct {
			Embedding []float64 `json:"embedding"`
		} `json:"data"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	if len(result.Data) == 0 {
		return nil, fmt.Errorf("no embedding returned")
	}

	return result.Data[0].Embedding, nil
}

func (s *regulasiService) generateAISynthesis(ctx context.Context, query string, chunks []RegulasiSearchResult) string {
	if s.sumopodURL == "" || s.sumopodKey == "" {
		return "AI Synthesis not available."
	}

	sumopodURL := strings.TrimSuffix(s.sumopodURL, "/")
	var endpoint string
	if strings.HasSuffix(sumopodURL, "/v1") {
		endpoint = sumopodURL + "/chat/completions"
	} else {
		endpoint = sumopodURL + "/v1/chat/completions"
	}

	var contextText string
	for i, chunk := range chunks {
		contextText += fmt.Sprintf("[%d] %s (%s): %s\n", i+1, chunk.RegName, chunk.Article, chunk.Content)
	}

	prompt := fmt.Sprintf(`Kamu adalah Asisten Hukum Lingkungan (Green Law AI). 
Tugasmu adalah menjawab pertanyaan pengguna berdasarkan referensi regulasi berikut. 
Jawablah dengan ringkas, profesional, dan to the point.

Pertanyaan: %s

Referensi Regulasi:
%s`, query, contextText)

	reqBody, _ := json.Marshal(map[string]interface{}{
		"model": "gemini/gemini-3.1-flash-lite",
		"messages": []map[string]string{
			{"role": "user", "content": prompt},
		},
		"temperature": 0.3,
	})

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewBuffer(reqBody))
	if err != nil {
		return "Failed to generate AI summary."
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.sumopodKey)

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "Failed to fetch AI summary."
	}
	defer resp.Body.Close()

	var result struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil || len(result.Choices) == 0 {
		return "Could not parse AI response."
	}

	return result.Choices[0].Message.Content
}

func (s *regulasiService) Search(ctx context.Context, query string) (*RegulasiSearchResponse, error) {
	// Check cache first
	s.cacheMutex.RLock()
	if cached, ok := s.searchCache[query]; ok {
		s.cacheMutex.RUnlock()
		return cached, nil
	}
	s.cacheMutex.RUnlock()

	emb, err := s.getEmbedding(ctx, query)
	if err != nil {
		log.Printf("❌ Failed to get embedding: %v", err)
		return nil, err
	}

	embStrBytes, _ := json.Marshal(emb)
	embStr := string(embStrBytes)

	var results []RegulasiSearchResult
	rawQuery := fmt.Sprintf(`
		SELECT id, "regName", article, content, "riskCategory", 
		1 - (embedding <=> '%s'::vector) AS similarity 
		FROM regulasi_knowledge_base 
		ORDER BY embedding <=> '%s'::vector 
		LIMIT 5;
	`, embStr, embStr)

	err = s.dbClient.Prisma.QueryRaw(rawQuery).Exec(ctx, &results)
	if err != nil {
		log.Printf("❌ Prisma QueryRaw failed: %v", err)
		return nil, err
	}

	aiSummary := s.generateAISynthesis(ctx, query, results)

	response := &RegulasiSearchResponse{
		AiSummary: aiSummary,
		Results:   results,
	}

	// Save to cache
	s.cacheMutex.Lock()
	s.searchCache[query] = response
	s.cacheMutex.Unlock()

	return response, nil
}

func (s *regulasiService) GetRecommendations(ctx context.Context, userID string) ([]RegulasiSearchResult, error) {
	// Fetch user's recent audits
	audits, err := s.auditRepo.GetAuditsByUserID(ctx, userID)
	if err != nil {
		log.Printf("Failed to fetch audits for recommendations: %v", err)
	}

	searchQuery := "Peraturan tentang lingkungan hidup, bursa karbon, dan energi terbarukan."
	if len(audits) > 0 {
		// Compile a prompt to generate a tailored search query
		auditTitles := ""
		for i, a := range audits {
			if i >= 5 {
				break
			}
			auditTitles += "- " + a.ProjectName + "\n"
		}

		sumopodURL := strings.TrimSuffix(s.sumopodURL, "/")
		var endpoint string
		if strings.HasSuffix(sumopodURL, "/v1") {
			endpoint = sumopodURL + "/chat/completions"
		} else {
			endpoint = sumopodURL + "/v1/chat/completions"
		}

		prompt := fmt.Sprintf(`Pengguna ini sering menganalisis proyek-proyek berikut:
%s
Buatlah 1 kalimat query pencarian singkat (maksimal 10 kata) yang relevan untuk mencari peraturan terkait proyek-proyek tersebut. Jangan gunakan tanda kutip atau penjelasan, cukup query-nya saja.`, auditTitles)

		reqBody, _ := json.Marshal(map[string]interface{}{
			"model": "gemini/gemini-3.1-flash-lite",
			"messages": []map[string]string{
				{"role": "user", "content": prompt},
			},
			"temperature": 0.5,
		})

		req, reqErr := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewBuffer(reqBody))
		if reqErr == nil {
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("Authorization", "Bearer "+s.sumopodKey)

			resp, doErr := s.httpClient.Do(req)
			if doErr == nil {
				defer resp.Body.Close()
				var result struct {
					Choices []struct {
						Message struct {
							Content string `json:"content"`
						} `json:"message"`
					} `json:"choices"`
				}
				if json.NewDecoder(resp.Body).Decode(&result) == nil && len(result.Choices) > 0 {
					searchQuery = strings.TrimSpace(result.Choices[0].Message.Content)
					log.Printf("Generated tailored recommendation query: %s", searchQuery)
				}
			}
		}
	}

	// Now run the vector search using the tailored query
	emb, err := s.getEmbedding(ctx, searchQuery)
	if err != nil {
		return nil, err
	}

	embStrBytes, _ := json.Marshal(emb)
	embStr := string(embStrBytes)

	var results []RegulasiSearchResult
	rawQuery := fmt.Sprintf(`
		SELECT id, "regName", article, content, "riskCategory", 
		1 - (embedding <=> '%s'::vector) AS similarity 
		FROM regulasi_knowledge_base 
		ORDER BY embedding <=> '%s'::vector 
		LIMIT 4;
	`, embStr, embStr)

	err = s.dbClient.Prisma.QueryRaw(rawQuery).Exec(ctx, &results)
	if err != nil {
		return nil, err
	}

	return results, nil
}
