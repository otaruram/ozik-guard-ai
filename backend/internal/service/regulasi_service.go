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
	"time"

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

type RegulasiService interface {
	Search(ctx context.Context, query string) ([]RegulasiSearchResult, error)
}

type regulasiService struct {
	dbClient     *db.PrismaClient
	sumopodURL   string
	sumopodKey   string
	httpClient   *http.Client
}

func NewRegulasiService(dbClient *db.PrismaClient, sumopodURL, sumopodKey string) RegulasiService {
	return &regulasiService{
		dbClient:   dbClient,
		sumopodURL: sumopodURL,
		sumopodKey: sumopodKey,
		httpClient: &http.Client{Timeout: 30 * time.Second},
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

func (s *regulasiService) Search(ctx context.Context, query string) ([]RegulasiSearchResult, error) {
	// 1. Get embedding
	emb, err := s.getEmbedding(ctx, query)
	if err != nil {
		log.Printf("❌ Failed to get embedding: %v", err)
		return nil, err
	}

	// Format embedding vector string for pgvector: '[1.0, 2.0, ...]'
	embStrBytes, _ := json.Marshal(emb)
	embStr := string(embStrBytes)

	// 2. Query Prisma with raw SQL
	// We select the closest 5 rules
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

	return results, nil
}
