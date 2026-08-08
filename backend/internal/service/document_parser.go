package service

import (
	"bytes"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"github.com/dslipak/pdf"
)

type DocumentParserService interface {
	ParseCustomRange(input string, totalPages int) []int
	ExtractTargetPages(filePath string, pageMode string, customRange string) (string, []int, error)
}

type documentParserService struct{}

func NewDocumentParserService() DocumentParserService {
	return &documentParserService{}
}

// ParseCustomRange parses a string like "1-3, 5, 8" into an array of page numbers [1, 2, 3, 5, 8]
func (s *documentParserService) ParseCustomRange(input string, totalPages int) []int {
	input = strings.ReplaceAll(input, " ", "")
	if input == "" {
		return []int{}
	}

	pageSet := make(map[int]bool)
	parts := strings.Split(input, ",")

	for _, part := range parts {
		if strings.Contains(part, "-") {
			rangeParts := strings.Split(part, "-")
			if len(rangeParts) == 2 {
				start, err1 := strconv.Atoi(rangeParts[0])
				end, err2 := strconv.Atoi(rangeParts[1])
				if err1 == nil && err2 == nil && start <= end {
					for i := start; i <= end; i++ {
						if i > 0 && i <= totalPages {
							pageSet[i] = true
						}
					}
				}
			}
		} else {
			val, err := strconv.Atoi(part)
			if err == nil && val > 0 && val <= totalPages {
				pageSet[val] = true
			}
		}
	}

	var pages []int
	for page := range pageSet {
		pages = append(pages, page)
	}
	sort.Ints(pages)
	return pages
}

func (s *documentParserService) ExtractTargetPages(filePath string, pageMode string, customRange string) (string, []int, error) {
	r, err := pdf.Open(filePath)
	if err != nil {
		return "", nil, err
	}

	totalPages := r.NumPage()
	if totalPages == 0 {
		return "", nil, fmt.Errorf("no pages found in PDF")
	}

	var targetPages []int
	if pageMode == "teaser" {
		maxTeaser := 3
		if totalPages < 3 {
			maxTeaser = totalPages
		}
		for i := 1; i <= maxTeaser; i++ {
			targetPages = append(targetPages, i)
		}
	} else if pageMode == "custom" {
		targetPages = s.ParseCustomRange(customRange, totalPages)
	} else {
		// "full" or empty
		for i := 1; i <= totalPages; i++ {
			targetPages = append(targetPages, i)
		}
	}

	if len(targetPages) == 0 {
		return "", nil, fmt.Errorf("no valid pages selected")
	}

	var extractedText strings.Builder
	for _, pageNum := range targetPages {
		p := r.Page(pageNum)
		if p.V.IsNull() {
			continue
		}
		
		content, err := p.GetPlainText(nil)
		if err == nil {
			extractedText.WriteString(fmt.Sprintf("\n--- PAGE %d ---\n", pageNum))
			extractedText.WriteString(content)
		}
	}
	
	if extractedText.Len() == 0 {
		// Fallback to reading the entire document
		var buf bytes.Buffer
		b, err := r.GetPlainText()
		if err == nil {
			buf.ReadFrom(b)
			return buf.String(), targetPages, nil
		}
	}

	return extractedText.String(), targetPages, nil
}
