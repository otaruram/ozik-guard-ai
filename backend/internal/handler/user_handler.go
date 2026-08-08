package handler

import (
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/repository"

	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	userRepo repository.UserRepository
}

func NewUserHandler(userRepo repository.UserRepository) *UserHandler {
	return &UserHandler{userRepo: userRepo}
}

// GetMe returns the authenticated user's profile
// GET /api/v1/user/me
func (h *UserHandler) GetMe(c *fiber.Ctx) error {
	userID := c.Locals("userId")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(domain.ErrorResponse{
			Error: "UNAUTHORIZED",
		})
	}

	uid := userID.(string)
	user, err := h.userRepo.GetByID(c.Context(), uid)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(domain.ErrorResponse{
			Error:   "USER_NOT_FOUND",
			Message: "Akun pengguna tidak ditemukan.",
		})
	}

	return c.Status(fiber.StatusOK).JSON(domain.UserMeResponse{
		ID:             user.ID,
		Email:          user.Email,
		Name:           user.Name,
		AvatarURL:      user.AvatarURL,
		Company:        user.Company,
		Provider:       user.Provider,
		CreditsBalance: user.CreditsBalance,
	})
}

// UpdateMe updates the authenticated user's profile
// PUT /api/v1/user/me
func (h *UserHandler) UpdateMe(c *fiber.Ctx) error {
	userID := c.Locals("userId")
	if userID == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(domain.ErrorResponse{
			Error: "UNAUTHORIZED",
		})
	}

	uid := userID.(string)

	var req domain.UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(domain.ErrorResponse{
			Error: "Invalid request payload",
		})
	}

	updated, err := h.userRepo.UpdateProfile(c.Context(), uid, &req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(domain.ErrorResponse{
			Error: "UPDATE_FAILED",
		})
	}

	return c.Status(fiber.StatusOK).JSON(updated)
}
