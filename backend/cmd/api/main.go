package main

import (
	"log"
	"ozikcarbon-backend/config"
	"ozikcarbon-backend/internal/handler"
	"ozikcarbon-backend/internal/middleware"
	"ozikcarbon-backend/internal/repository"
	"ozikcarbon-backend/internal/service"
	"ozikcarbon-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// 1. Load Config
	cfg := config.LoadConfig()

	// 1.5 Prisma DB Client
	client := db.NewClient()
	if err := client.Prisma.Connect(); err != nil {
		log.Fatalf("Prisma DB Connection failed: %v", err)
	}
	defer func() {
		if err := client.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	// 2. Repositories (DI)
	auditRepo := repository.NewAuditRepository(client)
	userRepo := repository.NewUserRepository(client)

	// 3. Services (DI)
	piiMasker := service.NewPIIMaskerService()
	pasalID := service.NewPasalIdService()
	llmFactory := service.NewLLMFactoryService(cfg.SumopodURL, cfg.SumopodKey)
	scoringEngine := service.NewScoringEngineService()
	documentParser := service.NewDocumentParserService()
	auditService := service.NewAuditService(auditRepo, piiMasker, pasalID, llmFactory, scoringEngine)

	// 4. Handlers (DI)
	auditHandler := handler.NewAuditHandler(auditService, auditRepo, userRepo, documentParser)
	verifyHandler := handler.NewVerifyHandler(auditRepo)
	userHandler := handler.NewUserHandler(userRepo)
	freeAuditHandler := handler.NewFreeAuditHandler(piiMasker, pasalID, llmFactory, scoringEngine)

	// 5. Fiber App Init
	app := fiber.New(fiber.Config{
		AppName: "OzikSustain API v1.0",
	})

	// 6. Global Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:8081, http://localhost:3000, https://oziksustain.id, https://oziksustain.my.id, https://www.oziksustain.my.id, https://oziksustain.vercel.app, https://ozikgrid.web.id",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// 7. Routes
	v1 := app.Group("/api/v1")

	// === Public Routes (No Auth) ===
	v1.Post("/audit/guest-teaser", freeAuditHandler.GuestTeaser)
	v1.Get("/verify/:qr_hash", verifyHandler.GetVerification)

	// === Protected Routes (Supabase JWT) ===
	protected := v1.Group("", middleware.SupabaseAuthMiddleware(cfg, userRepo))

	// User Profile
	protected.Get("/user/me", userHandler.GetMe)
	protected.Put("/user/me", userHandler.UpdateMe)
	protected.Post("/user/api-key/regenerate", userHandler.RegenerateAPIKey)

	// Audit (Credit-gated for full process)
	protected.Post("/audit/full-process", middleware.CreditMiddleware(userRepo, cfg), auditHandler.ProcessAudit)

	// Audit History & Detail (Protected, no credit needed)
	protected.Get("/audit/history", auditHandler.GetHistory)
	protected.Get("/audit/:id", auditHandler.GetAuditDetail)
	protected.Delete("/audit/:id", auditHandler.DeleteAudit)

	// 8. Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "OzikSustain API"})
	})

	// 9. Start Server
	log.Printf("🚀 OzikSustain API starting on port %s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
