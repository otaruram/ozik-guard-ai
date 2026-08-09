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
)

type LLMAnalysisResult struct {
	ScoreLegal        float64     `json:"scoreLegal"`
	ScoreTechnical    float64     `json:"scoreTechnical"`
	ScoreSocial       float64     `json:"scoreSocial"`
	ScoreTransparency float64     `json:"scoreTransparency"`
	Issues            []IssueData `json:"issues"`
}

type IssueData struct {
	Severity          string `json:"severity"` // HIGH_RISK, MEDIUM_RISK, COMPLIANT
	ClauseText        string `json:"clauseText"`
	MatchedLaw        string `json:"matchedLaw"`
	OriginalLawText   string `json:"originalLawText"`
	SuggestedRevision string `json:"suggestedRevision"`
}

type LLMFactoryService interface {
	AnalyzeClause(ctx context.Context, prompt string, lawContext []string, targetPages []int) (*LLMAnalysisResult, error)
}

type llmFactoryService struct {
	sumopodURL string
	apiKey     string
	client     *http.Client
}

func NewLLMFactoryService(sumopodURL, apiKey string) LLMFactoryService {
	return &llmFactoryService{
		sumopodURL: sumopodURL,
		apiKey:     apiKey,
		client: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

func (s *llmFactoryService) AnalyzeClause(ctx context.Context, prompt string, lawContext []string, targetPages []int) (*LLMAnalysisResult, error) {
	// Build target pages string
	targetPagesStr := "ALL_PAGES"
	if len(targetPages) > 0 {
		var strArr []string
		for _, p := range targetPages {
			strArr = append(strArr, fmt.Sprintf("%d", p))
		}
		targetPagesStr = strings.Join(strArr, ", ")
	}

	// Build law context string
	lawCtxStr := "No live law data available."
	if len(lawContext) > 0 {
		var filtered []string
		for _, l := range lawContext {
			if strings.TrimSpace(l) != "" {
				filtered = append(filtered, l)
			}
		}
		if len(filtered) > 0 {
			lawCtxStr = strings.Join(filtered, "\n")
		}
	}

	systemPrompt := fmt.Sprintf(`You are OzikSustain AI, an expert Indonesian environmental law compliance auditor.
You are analyzing a PDD (Project Design Document) for carbon credit projects.
You have been provided text extracted from the following specific pages: [%s].

Here are the active Indonesian laws retrieved from Pasal.id for context:
---
%s
---

Evaluate the document text against THESE specific laws.

You MUST output ONLY a valid JSON object (no markdown, no explanation) containing:
{
  "scoreLegal": <number 0-40>,
  "scoreTechnical": <number 0-30>,
  "scoreSocial": <number 0-15>,
  "scoreTransparency": <number 0-15>,
  "issues": [
    {
      "severity": "HIGH_RISK" | "MEDIUM_RISK",
      "clauseText": "<the problematic text from the document>",
      "matchedLaw": "<specific law reference e.g. UU No. 41/1999 Pasal 38>",
      "originalLawText": "<relevant excerpt from the matched law, or 'Teks spesifik tidak ditemukan.' if unavailable. DO NOT use '__'>",
      "suggestedRevision": "<specific actionable revision in Bahasa Indonesia>"
    }
  ]
}

Scoring guidelines:
- scoreLegal (max 40): Deduct for missing permits (IPPKH, AMDAL, UKL-UPL), unlicensed land use, overlap with protected forests
- scoreTechnical (max 30): Deduct for missing baseline methodology, unverified emission factors, no monitoring plan
- scoreSocial (max 15): Deduct for no FPIC documentation, missing community consultation, no benefit sharing
- scoreTransparency (max 15): Deduct for redacted data, missing appendices, vague commitments

Only flag issues that are genuinely non-compliant. If the document is clean, return high scores and an empty issues array.`, targetPagesStr, lawCtxStr)

	// Check if API key is available
	if s.apiKey == "" || s.apiKey == "mock-key" {
		log.Println("⚠️  WARNING: SUMOPOD_API_KEY is missing or mock. Using rule-based fallback scoring.")
		return s.ruleBasedFallback(prompt), nil
	}

	return s.callSumopod(ctx, systemPrompt, prompt)
}

func (s *llmFactoryService) callSumopod(ctx context.Context, systemPrompt string, userPrompt string) (*LLMAnalysisResult, error) {
	// Truncate user prompt if too long (most LLMs have token limits)
	if len(userPrompt) > 15000 {
		userPrompt = userPrompt[:15000] + "\n\n[...TRUNCATED FOR TOKEN LIMIT...]"
	}

	// Build OpenAI-compatible request payload
	payload := map[string]interface{}{
		"model": "claude-haiku-4-5-20250815",
		"messages": []map[string]string{
			{"role": "system", "content": systemPrompt},
			{"role": "user", "content": userPrompt},
		},
		"temperature": 0.1,
		"max_tokens":  4096,
	}

	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal LLM request: %w", err)
	}

	endpoint := strings.TrimSuffix(s.sumopodURL, "/") + "/chat/completions"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create LLM request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.apiKey)

	log.Printf("🤖 Calling Sumopod LLM at %s ...", endpoint)
	resp, err := s.client.Do(req)
	if err != nil {
		log.Printf("❌ Sumopod API call failed: %v. Falling back to rule-based scoring.", err)
		return s.ruleBasedFallback(userPrompt), nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("❌ Failed to read Sumopod response: %v", err)
		return s.ruleBasedFallback(userPrompt), nil
	}

	if resp.StatusCode != http.StatusOK {
		log.Printf("❌ Sumopod returned HTTP %d: %s. Falling back.", resp.StatusCode, string(body))
		return s.ruleBasedFallback(userPrompt), nil
	}

	// Parse OpenAI-compatible response
	var chatResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(body, &chatResp); err != nil {
		log.Printf("❌ Failed to parse Sumopod response JSON: %v", err)
		return s.ruleBasedFallback(userPrompt), nil
	}

	if len(chatResp.Choices) == 0 {
		log.Println("❌ Sumopod returned 0 choices. Falling back.")
		return s.ruleBasedFallback(userPrompt), nil
	}

	content := chatResp.Choices[0].Message.Content
	content = strings.TrimSpace(content)

	// Strip markdown code fences if LLM wrapped the JSON
	content = strings.TrimPrefix(content, "```json")
	content = strings.TrimPrefix(content, "```")
	content = strings.TrimSuffix(content, "```")
	content = strings.TrimSpace(content)

	var result LLMAnalysisResult
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		log.Printf("❌ Failed to parse LLM analysis JSON: %v\nRaw content: %s", err, content[:min(len(content), 500)])
		return s.ruleBasedFallback(userPrompt), nil
	}

	log.Printf("✅ LLM analysis complete: Legal=%.0f Tech=%.0f Social=%.0f Trans=%.0f Issues=%d",
		result.ScoreLegal, result.ScoreTechnical, result.ScoreSocial, result.ScoreTransparency, len(result.Issues))

	return &result, nil
}

// ruleBasedFallback provides keyword-based scoring when LLM is unavailable.
// This is NOT a mock — it's a deterministic fallback that produces variable results per document.
func (s *llmFactoryService) ruleBasedFallback(text string) *LLMAnalysisResult {
	log.Println("⚙️  Using rule-based fallback scoring engine.")

	lower := strings.ToLower(text)
	scoreLegal := 35.0
	scoreTech := 25.0
	scoreSocial := 12.0
	scoreTrans := 12.0
	var issues []IssueData

	// Legal deductions
	if strings.Contains(lower, "hutan produksi") || strings.Contains(lower, "kawasan hutan") {
		scoreLegal -= 10
		issues = append(issues, IssueData{
			Severity:          "HIGH_RISK",
			ClauseText:        extractContext(text, "hutan"),
			MatchedLaw:        "UU No. 41 Tahun 1999 Pasal 38 (Kehutanan)",
			OriginalLawText:   "Penggunaan kawasan hutan untuk kepentingan pembangunan di luar kegiatan kehutanan hanya dapat dilakukan di dalam kawasan hutan produksi dan kawasan hutan lindung dengan Izin Pinjam Pakai.",
			SuggestedRevision: "Lampirkan bukti permohonan IPPKH ke KLHK atau pastikan koordinat proyek di luar area kawasan hutan.",
		})
	}
	if !strings.Contains(lower, "amdal") && !strings.Contains(lower, "ukl-upl") && !strings.Contains(lower, "persetujuan lingkungan") {
		scoreLegal -= 8
		issues = append(issues, IssueData{
			Severity:          "HIGH_RISK",
			ClauseText:        "Dokumen tidak menyebutkan AMDAL, UKL-UPL, atau Persetujuan Lingkungan.",
			MatchedLaw:        "UU No. 32 Tahun 2009 Pasal 22 (Perlindungan Lingkungan Hidup)",
			OriginalLawText:   "Setiap usaha dan/atau kegiatan yang berdampak penting terhadap lingkungan hidup wajib memiliki AMDAL.",
			SuggestedRevision: "Sertakan dokumen AMDAL atau UKL-UPL yang telah disetujui oleh dinas lingkungan hidup terkait.",
		})
	}
	if strings.Contains(lower, "izin") && (strings.Contains(lower, "menunggu") || strings.Contains(lower, "belum")) {
		scoreLegal -= 5
		issues = append(issues, IssueData{
			Severity:          "MEDIUM_RISK",
			ClauseText:        extractContext(text, "izin"),
			MatchedLaw:        "Permen LHK No. 4 Tahun 2021",
			OriginalLawText:   "Setiap penanggung jawab usaha wajib memiliki Persetujuan Lingkungan sebelum memulai kegiatan konstruksi.",
			SuggestedRevision: "Sertakan status terkini perizinan atau nomor registrasi sementara dari dinas terkait.",
		})
	}

	// Technical deductions
	if !strings.Contains(lower, "baseline") && !strings.Contains(lower, "emisi") {
		scoreTech -= 5
	}
	if !strings.Contains(lower, "monitoring") && !strings.Contains(lower, "pemantauan") {
		scoreTech -= 5
	}

	// Social deductions
	if !strings.Contains(lower, "fpic") && !strings.Contains(lower, "konsultasi masyarakat") && !strings.Contains(lower, "musyawarah") {
		scoreSocial -= 5
		issues = append(issues, IssueData{
			Severity:          "MEDIUM_RISK",
			ClauseText:        "Tidak ditemukan dokumentasi FPIC atau konsultasi masyarakat.",
			MatchedLaw:        "Permen LHK No. 9 Tahun 2021 (Pengelolaan Perhutanan Sosial)",
			OriginalLawText:   "Pelaksanaan kegiatan di kawasan hutan wajib melibatkan masyarakat sekitar melalui proses FPIC.",
			SuggestedRevision: "Tambahkan lampiran bukti pelaksanaan FPIC dan notulen musyawarah dengan masyarakat adat/lokal.",
		})
	}

	// Transparency deductions
	if !strings.Contains(lower, "lampiran") && !strings.Contains(lower, "appendix") {
		scoreTrans -= 3
	}

	// Clamp scores
	if scoreLegal < 0 {
		scoreLegal = 0
	}
	if scoreTech < 0 {
		scoreTech = 0
	}
	if scoreSocial < 0 {
		scoreSocial = 0
	}
	if scoreTrans < 0 {
		scoreTrans = 0
	}

	return &LLMAnalysisResult{
		ScoreLegal:        scoreLegal,
		ScoreTechnical:    scoreTech,
		ScoreSocial:       scoreSocial,
		ScoreTransparency: scoreTrans,
		Issues:            issues,
	}
}

// extractContext finds a keyword in the text and returns surrounding context
func extractContext(text string, keyword string) string {
	lower := strings.ToLower(text)
	idx := strings.Index(lower, keyword)
	if idx == -1 {
		return "Konteks tidak ditemukan."
	}
	start := idx - 100
	if start < 0 {
		start = 0
	}
	end := idx + 200
	if end > len(text) {
		end = len(text)
	}
	return strings.TrimSpace(text[start:end])
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
