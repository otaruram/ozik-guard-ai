package handler

import (
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/repository"
	"ozikcarbon-backend/internal/service"
	"strings"

	"github.com/gofiber/fiber/v2"
)

type AuditHandler struct {
	auditService   service.AuditService
	auditRepo      repository.AuditRepository
	userRepo       repository.UserRepository
	documentParser service.DocumentParserService
	emailService   service.EmailService
}

func NewAuditHandler(
	auditService service.AuditService,
	auditRepo repository.AuditRepository,
	userRepo repository.UserRepository,
	documentParser service.DocumentParserService,
	emailService service.EmailService,
) *AuditHandler {
	return &AuditHandler{
		auditService:   auditService,
		auditRepo:      auditRepo,
		userRepo:       userRepo,
		documentParser: documentParser,
		emailService:   emailService,
	}
}

// ProcessAudit handles POST /api/v1/audit/full-process (Protected, Credit-gated)
func (h *AuditHandler) ProcessAudit(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("document")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error:   "MISSING_DOCUMENT",
			Message: "Harap unggah dokumen PDF/DOCX/TXT.",
		})
	}

	projectName := c.FormValue("projectName")
	if projectName == "" {
		projectName = fileHeader.Filename
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: "FILE_READ_ERROR",
		})
	}
	defer file.Close()

	pageMode := c.FormValue("page_mode")
	customRange := c.FormValue("custom_range")

	var text string
	var targetPages []int
	if strings.HasSuffix(strings.ToLower(fileHeader.Filename), ".pdf") {
		// Save temporarily
		c.SaveFile(fileHeader, "./temp.pdf")
		
		extractedText, parsedPages, err := h.documentParser.ExtractTargetPages("./temp.pdf", pageMode, customRange)
		if err == nil {
			text = extractedText
			targetPages = parsedPages
		} else {
			// Fallback
			text = "DOKUMEN_TIDAK_TERBACA\n\nSistem gagal mengekstrak teks dari dokumen Anda. Hal ini biasanya terjadi jika PDF merupakan hasil scan (gambar) atau dokumen terkunci. Pastikan dokumen PDD Anda berisi teks yang dapat disalin (selectable text) agar AI OzikSustain dapat melakukan analisis spasial dan regulasi secara optimal."
		}
	} else {
		buf := make([]byte, fileHeader.Size)
		_, _ = file.Read(buf)
		text = string(buf)
	}

	if len(text) < 10 {
		text = "DOKUMEN_TIDAK_TERBACA\n\nSistem gagal mengekstrak teks dari dokumen Anda. Hal ini biasanya terjadi jika PDF merupakan hasil scan (gambar) atau dokumen terkunci. Pastikan dokumen PDD Anda berisi teks yang dapat disalin (selectable text) agar AI OzikSustain dapat melakukan analisis spasial dan regulasi secara optimal."
	}

	req := domain.ProcessAuditRequest{
		ProjectName: projectName,
		PDDText:     text,
		TargetPages: targetPages,
	}

	userID := c.Locals("userId")
	if userID != nil {
		req.UserID = userID.(string)
	}

	res, err := h.auditService.ProcessAudit(c.Context(), &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: err.Error(),
		})
	}

	if userID != nil {
		uid := userID.(string)
		err = h.userRepo.DeductCredit(c.Context(), uid)
		if err != nil {
			// Even if deduction fails, we might still want to return the result, but log it
			// Or fail it. We will just proceed since generation succeeded.
		}

		// Trigger Email if preferences allow
		user, errUser := h.userRepo.GetByID(c.Context(), uid)
		if errUser == nil && user.NotifyReportDone && h.emailService != nil {
			go h.emailService.SendReportDoneEmail(user.Email, user.Name, req.ProjectName, res.Status)
		}
	}

	return c.Status(fiber.StatusOK).JSON(res)
}

// GetHistory handles GET /api/v1/audit/history (Protected)
func (h *AuditHandler) GetHistory(c *fiber.Ctx) error {
	userID := c.Locals("userId")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(domain.ErrorResponse{
			Error: "UNAUTHORIZED",
		})
	}

	uid := userID.(string)
	audits, err := h.auditRepo.GetAuditsByUserID(c.Context(), uid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: "FETCH_ERROR",
		})
	}

	return c.Status(fiber.StatusOK).JSON(domain.AuditHistoryResponse{
		Audits:     audits,
		TotalCount: len(audits),
	})
}

// GetAuditDetail handles GET /api/v1/audit/:id (Protected)
func (h *AuditHandler) GetAuditDetail(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error: "Missing audit ID",
		})
	}

	audit, err := h.auditRepo.GetAuditByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(domain.ErrorResponse{
			Error:   "AUDIT_NOT_FOUND",
			Message: "Data audit tidak ditemukan.",
		})
	}

	return c.Status(fiber.StatusOK).JSON(audit)
}

// DeleteAudit handles DELETE /api/v1/audit/:id (Protected)
func (h *AuditHandler) DeleteAudit(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error: "Missing audit ID",
		})
	}

	userID := c.Locals("userId")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(domain.ErrorResponse{
			Error: "UNAUTHORIZED",
		})
	}
	uid := userID.(string)

	err := h.auditRepo.DeleteAudit(c.Context(), id, uid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: "DELETE_FAILED",
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}
