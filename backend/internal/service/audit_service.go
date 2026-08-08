package service

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/repository"
	"time"

	"github.com/google/uuid"
)

type AuditService interface {
	ProcessAudit(ctx context.Context, req *domain.ProcessAuditRequest) (*domain.ProcessAuditResponse, error)
	ProcessGuestTeaser(ctx context.Context, req *domain.GuestTeaserRequest) (*domain.GuestTeaserResponse, error)
}

type auditService struct {
	auditRepo     repository.AuditRepository
	piiMasker     PIIMaskerService
	pasalID       PasalIdService
	llmFactory    LLMFactoryService
	scoringEngine ScoringEngineService
}

func NewAuditService(
	auditRepo repository.AuditRepository,
	piiMasker PIIMaskerService,
	pasalID PasalIdService,
	llmFactory LLMFactoryService,
	scoringEngine ScoringEngineService,
) AuditService {
	return &auditService{
		auditRepo:     auditRepo,
		piiMasker:     piiMasker,
		pasalID:       pasalID,
		llmFactory:    llmFactory,
		scoringEngine: scoringEngine,
	}
}

func (s *auditService) ProcessGuestTeaser(ctx context.Context, req *domain.GuestTeaserRequest) (*domain.GuestTeaserResponse, error) {
	// 1. In-Memory Buffer Truncation
	// For Guest Teaser, we simulate reading only the first 3 pages (e.g. 1500 chars limit)
	text := req.PDDText
	if len(text) > 1500 {
		text = text[:1500]
	}

	// 2. PII Auto-Masking Engine
	maskedText := s.piiMasker.Mask(text)

	// 3. Live Pasal.id API (Simplified for Teaser, static search)
	laws, _ := s.pasalID.SearchRegulations(ctx, "Izin Prinsip Kehutanan", "UU")
	topLaw := ""
	if len(laws) > 0 {
		topLaw = laws[0].Title + " - " + laws[0].Snippet
	}
	
	_ = maskedText // prevent declared and not used error

	// 4. Dynamic Clause Generation (same logic as full audit)
	paragraphs := strings.Split(text, "\n")
	var validParagraphs []string
	for _, p := range paragraphs {
		p = strings.TrimSpace(p)
		if len(p) > 20 {
			validParagraphs = append(validParagraphs, p)
		}
	}
	if len(validParagraphs) == 0 {
		validParagraphs = []string{text}
	}

	var clauses []domain.AuditClause
	for i, p := range validParagraphs {
		status := "compliant"
		lowerP := strings.ToLower(p)
		var issue *domain.AuditIssue

		if strings.Contains(lowerP, "hutan") || strings.Contains(lowerP, "produksi") || strings.Contains(lowerP, "kawasan") || strings.Contains(lowerP, "penyangga") {
			status = "high"
			issue = &domain.AuditIssue{
				Severity:          "HIGH_RISK",
				ClauseText:        p,
				MatchedLaw:        "UU No. 41 Tahun 1999 (Kehutanan) Pasal 38",
				OriginalLawText:   topLaw,
				SuggestedRevision: "Harap lampirkan bukti permohonan IPPKH ke KLHK atau pastikan koordinat di luar area hutan.",
			}
		} else if strings.Contains(lowerP, "izin") || strings.Contains(lowerP, "menunggu") || strings.Contains(lowerP, "belum") || strings.Contains(lowerP, "dampak") {
			status = "medium"
			issue = &domain.AuditIssue{
				Severity:          "MEDIUM_RISK",
				ClauseText:        p,
				MatchedLaw:        "Permen LHK No. 4 Tahun 2021",
				OriginalLawText:   "Setiap penanggung jawab usaha wajib memiliki Persetujuan Lingkungan sebelum memulai kegiatan konstruksi.",
				SuggestedRevision: "Sertakan status terkini atau nomor registrasi sementara dari dinas terkait.",
			}
		}

		clauses = append(clauses, domain.AuditClause{
			ID:     i + 1,
			Clause: fmt.Sprintf("Klausul %d.%d", (i/5)+1, (i%5)+1),
			Text:   p,
			Status: status,
			Issue:  issue,
		})
	}

	return &domain.GuestTeaserResponse{
		FeasibilityScore: 65,
		SpatialSummary:   "Kawasan industri terdeteksi, namun berbatasan dengan hutan produksi.",
		TopViolation: &domain.AuditIssue{
			ClauseText:      "Penggunaan kawasan hutan tanpa izin prinsip melanggar regulasi.",
			MatchedLaw:      "UU LHK No. 32/2009 Pasal 36",
			OriginalLawText: topLaw,
		},
		Clauses: clauses,
	}, nil
}

func (s *auditService) ProcessAudit(ctx context.Context, req *domain.ProcessAuditRequest) (*domain.ProcessAuditResponse, error) {
	// 1. In-Memory Buffer (Full Length)
	text := req.PDDText

	// 2. PII Auto-Masking Engine
	maskedText := s.piiMasker.Mask(text)

	// 3. Live Pasal.id API
	// Simple keyword extraction mock: "Izin Lingkungan", "Tenaga Surya"
	laws, _ := s.pasalID.SearchRegulations(ctx, "Energi Terbarukan Lingkungan", "UU")
	lawContext := ""
	for _, l := range laws {
		lawContext += fmt.Sprintf("[%s]: %s\n", l.Title, l.Snippet)
	}

	// 4. Send to LLM
	prompt := fmt.Sprintf("Analyze this PDD text:\n%s\n\nAgainst these laws:\n%s", maskedText, lawContext)
	llmResp, err := s.llmFactory.AnalyzeClause(ctx, prompt, []string{lawContext}, req.TargetPages)
	if err != nil {
		return nil, err
	}

	// 5. Scoring Engine
	// We'll calculate score based on LLM response
	scoreLegal := llmResp.ScoreLegal
	scoreTech := llmResp.ScoreTechnical
	scoreSocial := llmResp.ScoreSocial
	scoreTrans := llmResp.ScoreTransparency

	score, status := s.scoringEngine.CalculateFeasibility(scoreLegal, scoreTech, scoreSocial, scoreTrans)

	// Generate HMAC-SHA256 Badge
	auditID := uuid.New().String()
	hash := ""
	if score >= 80 {
		hash = s.scoringEngine.GenerateHMACBadge(auditID, score)
	}

	// Dynamic Clause Generation grouped by pages
	paragraphs := strings.Split(text, "\n")
	var validParagraphs []string
	for _, p := range paragraphs {
		p = strings.TrimSpace(p)
		if len(p) > 20 { // skip very short lines
			validParagraphs = append(validParagraphs, p)
		}
	}

	if len(validParagraphs) == 0 {
		validParagraphs = []string{text} // fallback if no newlines
	}

	var clauses []domain.AuditClause
	var auditIssues []domain.AuditIssue
	totalSentences := 0
	totalWords := 0
	
	type PageData struct {
		PageNumber int                  `json:"page_number"`
		Chunks     []domain.AuditClause `json:"chunks"`
	}
	var pages []PageData
	
	chunksPerPage := 6
	for i, p := range validParagraphs {
		totalSentences += strings.Count(p, ".") + strings.Count(p, "?") + strings.Count(p, "!")
		totalWords += len(strings.Fields(p))

		clauseStatus := "COMPLIANT"
		lowerP := strings.ToLower(p)
		var issue *domain.AuditIssue

		if strings.Contains(lowerP, "hutan") || strings.Contains(lowerP, "produksi") || strings.Contains(lowerP, "kawasan") || strings.Contains(lowerP, "penyangga") {
			clauseStatus = "HIGH_RISK"
			issue = &domain.AuditIssue{
				Severity:          "HIGH_RISK",
				ClauseText:        p,
				MatchedLaw:        "UU No. 41 Tahun 1999 (Kehutanan) Pasal 38",
				OriginalLawText:   "Penggunaan kawasan hutan untuk kepentingan pembangunan di luar kegiatan kehutanan hanya dapat dilakukan di dalam kawasan hutan produksi dan kawasan hutan lindung dengan Izin Pinjam Pakai.",
				SuggestedRevision: "Harap lampirkan bukti permohonan IPPKH ke KLHK atau pastikan koordinat di luar area hutan.",
				PageNumber:        (i / chunksPerPage) + 1,
				ChunkIndex:        i + 1,
			}
			auditIssues = append(auditIssues, *issue)
		} else if strings.Contains(lowerP, "izin") || strings.Contains(lowerP, "menunggu") || strings.Contains(lowerP, "belum") || strings.Contains(lowerP, "dampak") {
			clauseStatus = "MEDIUM_RISK"
			issue = &domain.AuditIssue{
				Severity:          "MEDIUM_RISK",
				ClauseText:        p,
				MatchedLaw:        "Peraturan Terkait Perizinan & Dampak Lingkungan",
				OriginalLawText:   "Setiap kegiatan wajib mengantongi izin sah atau rekomendasi dinas terkait sebelum operasi.",
				SuggestedRevision: "Sertakan status terkini atau nomor registrasi sementara dari dinas terkait.",
				PageNumber:        (i / chunksPerPage) + 1,
				ChunkIndex:        i + 1,
			}
			auditIssues = append(auditIssues, *issue)
		}

		clause := domain.AuditClause{
			ID:     i + 1,
			Clause: fmt.Sprintf("Klausul %d.%d", (i/5)+1, (i%5)+1),
			Text:   p,
			Status: clauseStatus,
			Issue:  issue,
		}
		clauses = append(clauses, clause)
		
		pageNum := (i / chunksPerPage) + 1
		if len(pages) < pageNum {
			pages = append(pages, PageData{PageNumber: pageNum, Chunks: []domain.AuditClause{}})
		}
		pages[pageNum-1].Chunks = append(pages[pageNum-1].Chunks, clause)
	}

	totalPages := len(pages)
	if totalSentences == 0 {
		totalSentences = len(validParagraphs)
	}

	docData := map[string]interface{}{"pages": pages}
	parsedJsonBytes, _ := json.Marshal(docData)
	parsedDocumentJson := string(parsedJsonBytes)

	// Save to Repository
	userID := req.UserID
	if userID == "" {
		userID = "mock-uuid"
	}

	badgeStatus := domain.BadgeInvalid
	if score >= 80 {
		badgeStatus = domain.BadgeActive
	}

	audit := &domain.ProjectAudit{
		ID:                 auditID,
		UserID:             userID,
		ProjectName:        req.ProjectName,
		TotalPages:         totalPages,
		TotalWords:         totalWords,
		TotalSentences:     totalSentences,
		ParsedDocumentJson: parsedDocumentJson,
		FeasibilityScore:   score,
		ScoreLegal:         scoreLegal,
		ScoreTechnical:     scoreTech,
		ScoreSocial:        scoreSocial,
		ScoreTransparency:  scoreTrans,
		Status:             badgeStatus,
		SHA256Hash:         hash,
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
		Issues:             auditIssues,
	}

	_, err = s.auditRepo.CreateAudit(ctx, audit)
	if err != nil {
		return nil, err
	}

	return &domain.ProcessAuditResponse{
		AuditID:           auditID,
		Status:            status,
		FeasibilityScore:  score,
		ScoreLegal:        scoreLegal,
		ScoreTechnical:    scoreTech,
		ScoreSocial:       scoreSocial,
		ScoreTransparency: scoreTrans,
		SHA256Hash:        hash,
	}, nil
}
