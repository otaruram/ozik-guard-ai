package service

import (
	"context"
	"fmt"
	"log"
	"strings"

	"ozikcarbon-backend/prisma/db"
)

type RAGService interface {
	QueryPasalDatabase(ctx context.Context, clause string) ([]string, error)
}

type ragService struct {
	client       *db.PrismaClient
	embeddingSvc EmbeddingService
}

func NewRAGService(client *db.PrismaClient, embeddingSvc EmbeddingService) RAGService {
	return &ragService{
		client:       client,
		embeddingSvc: embeddingSvc,
	}
}

type RAGResult struct {
	RegName string `json:"regName"`
	Article string `json:"article"`
	Content string `json:"content"`
}

func (s *ragService) QueryPasalDatabase(ctx context.Context, clause string) ([]string, error) {
	// Generate Embedding for the query clause
	vec, err := s.embeddingSvc.GenerateEmbedding(ctx, clause)
	if err != nil {
		log.Printf("⚠️ Failed to generate embedding for RAG query: %v", err)
		return nil, err
	}

	// Convert []float32 to string format "[1.2, 3.4, ...]" for pgvector query
	var strVec []string
	for _, v := range vec {
		strVec = append(strVec, fmt.Sprintf("%f", v))
	}
	pgvectorStr := "[" + strings.Join(strVec, ",") + "]"

	// Execute pgvector similarity search using <=> (cosine distance)
	rawQuery := `
		SELECT "regName", article, content 
		FROM regulasi_knowledge_base 
		ORDER BY embedding <=> $1::vector 
		LIMIT 3
	`

	var results []RAGResult
	err = s.client.Prisma.QueryRaw(rawQuery, pgvectorStr).Exec(ctx, &results)
	if err != nil {
		log.Printf("❌ Failed to query pgvector: %v", err)
		return nil, err
	}

	var contextLines []string
	for _, r := range results {
		contextLines = append(contextLines, fmt.Sprintf("[%s %s]: %s", r.RegName, r.Article, r.Content))
	}

	return contextLines, nil
}
