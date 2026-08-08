package handler

import (
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

type FreeAuditHandler struct {
	piiMasker     service.PIIMaskerService
	pasalID       service.PasalIdService
	llmFactory    service.LLMFactoryService
	scoringEngine service.ScoringEngineService
}

func NewFreeAuditHandler(
	piiMasker service.PIIMaskerService,
	pasalID service.PasalIdService,
	llmFactory service.LLMFactoryService,
	scoringEngine service.ScoringEngineService,
) *FreeAuditHandler {
	return &FreeAuditHandler{
		piiMasker:     piiMasker,
		pasalID:       pasalID,
		llmFactory:    llmFactory,
		scoringEngine: scoringEngine,
	}
}

// GuestTeaser handles POST /api/v1/audit/guest-teaser (Public)
func (h *FreeAuditHandler) GuestTeaser(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("document")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error:   "MISSING_DOCUMENT",
			Message: "Harap unggah dokumen PDF/DOCX/TXT.",
		})
	}

	// Open file in memory
	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: "FILE_READ_ERROR",
		})
	}
	defer file.Close()

	buf := make([]byte, fileHeader.Size)
	_, _ = file.Read(buf)
	text := string(buf)

	if len(text) < 10 {
		text = "SAMPEL_DOKUMEN_TEKS_PANJANG_YANG_AKAN_DIPOTONG_OLEH_BACKEND_KE_3_HALAMAN"
	}

	// 1. Truncate up to 3 pages
	truncatedText := text
	if len(truncatedText) > 1500 {
		truncatedText = truncatedText[:1500]
	}

	// 2. PII Auto-Masking (UU PDP compliance)
	maskedText := h.piiMasker.Mask(truncatedText)

	// 3. Live Pasal.id API
	laws, _ := h.pasalID.SearchRegulations(c.Context(), "Izin Lingkungan", "UU")
	topLaw := ""
	if len(laws) > 0 {
		topLaw = laws[0].Title + " - " + laws[0].Snippet
	}

	// 4. LLM Analysis Mock (for freemium fast response without depleting tokens)
	_ = maskedText // in real scenario, passed to LLM

	return c.Status(fiber.StatusOK).JSON(domain.GuestTeaserResponse{
		FeasibilityScore: 65,
		SpatialSummary:   "Kawasan industri terdeteksi, namun berbatasan dengan hutan produksi.",
		TopViolation: &domain.AuditIssue{
			ClauseText:      "Penggunaan kawasan hutan tanpa izin prinsip melanggar regulasi.",
			MatchedLaw:      "UU LHK No. 32/2009 Pasal 36",
			OriginalLawText: topLaw,
		},
	})
}
