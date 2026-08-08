package service

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"time"
)

type PasalIdLawResult struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Status  string `json:"status"`
	Snippet string `json:"snippet"`
	URL     string `json:"url"`
}

type pasalIdSearchResponse struct {
	Data []PasalIdLawResult `json:"data"`
}

type PasalIdService interface {
	SearchRegulations(ctx context.Context, query string, regType string) ([]PasalIdLawResult, error)
}

type pasalIdService struct {
	client  *http.Client
	baseURL string
}

func NewPasalIdService() PasalIdService {
	return &pasalIdService{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
		baseURL: "https://pasal.id/api/v1",
	}
}

func (s *pasalIdService) SearchRegulations(ctx context.Context, query string, regType string) ([]PasalIdLawResult, error) {
	apiKey := os.Getenv("PASAL_ID_API_KEY")
	if apiKey == "" {
		// Mock response for development if no key is provided
		return []PasalIdLawResult{
			{
				ID:      "mock-1",
				Title:   "UU LHK No. 32/2009",
				Status:  "berlaku",
				Snippet: "Penggunaan kawasan hutan produksi tanpa izin prinsip dilarang.",
				URL:     "https://pasal.id/uu-32-2009",
			},
		}, nil
	}

	searchURL := fmt.Sprintf("%s/search?q=%s&type=%s&limit=5", s.baseURL, url.QueryEscape(query), url.QueryEscape(regType))
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, searchURL, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Accept", "application/json")

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("pasal.id API error: status %d", resp.StatusCode)
	}

	var res pasalIdSearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return nil, err
	}

	// Filter only "berlaku" laws
	var activeLaws []PasalIdLawResult
	for _, law := range res.Data {
		if law.Status == "berlaku" {
			activeLaws = append(activeLaws, law)
		}
	}

	return activeLaws, nil
}
