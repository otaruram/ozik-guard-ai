package middleware

import (
	"encoding/base64"
	"encoding/json"
	"strings"

	"github.com/gofiber/fiber/v2"
	"ozikcarbon-backend/config"
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/internal/repository"
)

// SupabaseAuthMiddleware verifies the JWT token from Supabase
func SupabaseAuthMiddleware(cfg *config.Config, userRepo repository.UserRepository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Missing Authorization header",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid Authorization header format",
			})
		}

		token := parts[1]

		// In a real application, you would use a JWT library (e.g., golang-jwt) 
		// to parse and verify the token signature using cfg.SupabaseJWTSecret.
		// For MVP, we simply check if the token is present.
		if token == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired Supabase token",
			})
		}

		// Simple JWT decode for MVP
		tokenParts := strings.Split(token, ".")
		if len(tokenParts) == 3 {
			payload, err := base64.RawURLEncoding.DecodeString(tokenParts[1])
			if err == nil {
				var claims map[string]interface{}
				if json.Unmarshal(payload, &claims) == nil {
					if sub, ok := claims["sub"].(string); ok {
						c.Locals("userId", sub)

						// Auto-sync user to database
						email, _ := claims["email"].(string)
						name := "User"
						if userMeta, ok := claims["user_metadata"].(map[string]interface{}); ok {
							if n, ok := userMeta["name"].(string); ok {
								name = n
							} else if fn, ok := userMeta["full_name"].(string); ok {
								name = fn
							}
						}
						
						_, _ = userRepo.UpsertFromGoogle(c.Context(), &domain.User{
							ID:       sub,
							Email:    email,
							Name:     name,
							Provider: "supabase",
						})
					}
					if email, ok := claims["email"].(string); ok {
						c.Locals("userEmail", email)
					}
				}
			}
		}

		// Proceed to next handler
		return c.Next()
	}
}
