package config

import (
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port              string
	SumopodURL        string
	SumopodKey        string
	SupabaseURL       string
	SupabaseAnonKey   string
	SupabaseJWTSecret string
	AdminEmails       []string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found, using default environment variables")
	}

	return &Config{
		Port:              getEnv("PORT", "3000"),
		SumopodURL:        getEnv("SUMOPOD_URL", "https://ai.sumopod.com"),
		SumopodKey:        getEnv("SUMOPOD_API_KEY", "mock-key"),
		SupabaseURL:       getEnv("SUPABASE_URL", "https://mock.supabase.co"),
		SupabaseAnonKey:   getEnv("SUPABASE_ANON_KEY", "mock-anon-key"),
		SupabaseJWTSecret: getEnv("SUPABASE_JWT_SECRET", "mock-jwt-secret"),
		AdminEmails:       strings.Split(getEnv("ADMIN_EMAILS", ""), ","),
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
