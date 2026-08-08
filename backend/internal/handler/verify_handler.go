package handler

import (
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type VerifyHandler struct {
	auditRepo repository.AuditRepository
}

func NewVerifyHandler(auditRepo repository.AuditRepository) *VerifyHandler {
	return &VerifyHandler{auditRepo: auditRepo}
}

// GetVerification handles GET /api/v1/verify/:qr_hash
// Public endpoint for QR Badge scanning
func (h *VerifyHandler) GetVerification(c *fiber.Ctx) error {
	hash := c.Params("qr_hash")
	if hash == "" {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error: "Missing QR Hash",
		})
	}

	audit, err := h.auditRepo.GetAuditBySHA256Hash(c.Context(), hash)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(domain.ErrorResponse{
			Error:   "BADGE_NOT_FOUND",
			Message: "Lencana verifikasi tidak ditemukan atau tidak valid.",
		})
	}

	return c.Status(fiber.StatusOK).JSON(domain.PublicVerifyResponse{
		ProjectName:       audit.ProjectName,
		FeasibilityScore:  audit.FeasibilityScore,
		ScoreLegal:        audit.ScoreLegal,
		ScoreTechnical:    audit.ScoreTechnical,
		ScoreSocial:       audit.ScoreSocial,
		ScoreTransparency: audit.ScoreTransparency,
		Status:            audit.Status,
		AuditDate:         audit.CreatedAt,
		SHA256Hash:        audit.SHA256Hash,
		IntegrityHash:     "SHA256:" + audit.SHA256Hash,
	})
}
