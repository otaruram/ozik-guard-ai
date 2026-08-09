package handler

import (
	"ozikcarbon-backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

type RegulasiHandler struct {
	regulasiService service.RegulasiService
}

func NewRegulasiHandler(regulasiService service.RegulasiService) *RegulasiHandler {
	return &RegulasiHandler{
		regulasiService: regulasiService,
	}
}

func (h *RegulasiHandler) SearchRegulasi(c *fiber.Ctx) error {
	query := c.Query("q")
	if query == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Query parameter 'q' is required"})
	}

	results, err := h.regulasiService.Search(c.Context(), query)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to search regulasi: " + err.Error()})
	}

	return c.JSON(results)
}

func (h *RegulasiHandler) GetRecommendations(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	userIDStr := userID.(string)

	results, err := h.regulasiService.GetRecommendations(c.Context(), userIDStr)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get recommendations: " + err.Error()})
	}

	return c.JSON(results)
}
