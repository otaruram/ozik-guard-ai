package service

import "context"

type RAGService interface {
	QueryPasalDatabase(ctx context.Context, clause string) ([]string, error)
}

type ragService struct {
	// client *db.PrismaClient
}

func NewRAGService() RAGService {
	return &ragService{}
}

func (s *ragService) QueryPasalDatabase(ctx context.Context, clause string) ([]string, error) {
	// Mock vector similarity search using pgvector
	// Expected operation: SELECT text FROM Pasal WHERE document_vector <=> clause_vector < 0.1 LIMIT 3
	return []string{
		"UU LHK No. 32/2009 Pasal 36: Dilarang melakukan usaha tanpa izin lingkungan",
	}, nil
}
