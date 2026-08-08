package service

import (
	"context"
	"fmt"
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
			Timeout: 10 * time.Second,
		},
	}
}

func (s *llmFactoryService) AnalyzeClause(ctx context.Context, prompt string, lawContext []string, targetPages []int) (*LLMAnalysisResult, error) {
	// Build system prompt based on target pages
	targetPagesStr := "ALL_PAGES"
	if len(targetPages) > 0 {
		var strArr []string
		for _, p := range targetPages {
			strArr = append(strArr, fmt.Sprintf("%d", p))
		}
		targetPagesStr = strings.Join(strArr, ", ")
	}

	systemPrompt := fmt.Sprintf(`SYSTEM: You are analyzing a sliced document. You have only been provided text from the following specific pages: [%s]. Analyze ONLY these pages. Map your issues strictly to these page numbers.
You MUST output a valid JSON containing 4 exact numeric sub-scores based on the CarbonCredible standard:
- scoreLegal (Max 40)
- scoreTechnical (Max 30)
- scoreSocial (Max 15)
- scoreTransparency (Max 15)
Plus an "issues" array containing any non-compliant clauses.

%s`, targetPagesStr, prompt)

	// Send to Sumopod API (Claude Haiku 4.5)
	return s.callSumopod(ctx, systemPrompt, lawContext)
}

func (s *llmFactoryService) callSumopod(ctx context.Context, prompt string, lawContext []string) (*LLMAnalysisResult, error) {
	// Simulate HTTP call to https://ai.sumopod.com/v1
	// ... logic to build JSON payload and send HTTP POST ...
	
	// Mock successful response
	return &LLMAnalysisResult{
		ScoreLegal:        38,
		ScoreTechnical:    25,
		ScoreSocial:       12,
		ScoreTransparency: 10,
		Issues: []IssueData{
			{
				Severity:          "HIGH_RISK",
				ClauseText:        prompt,
				MatchedLaw:        "UU LHK No. 32/2009 Pasal 36",
				OriginalLawText:   "Dilarang melakukan usaha tanpa izin lingkungan",
				SuggestedRevision: "Ajukan Izin Pinjam Pakai Kawasan Hutan (IPPKH)",
			},
		},
	}, nil
}
