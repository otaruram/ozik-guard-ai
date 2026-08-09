package repository

import (
	"context"
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/prisma/db"
)

type AuditRepository interface {
	CreateAudit(ctx context.Context, audit *domain.ProjectAudit) (*domain.ProjectAudit, error)
	GetAuditByID(ctx context.Context, id string) (*domain.ProjectAudit, error)
	GetAuditsByUserID(ctx context.Context, userID string) ([]domain.ProjectAudit, error)
	GetAuditBySHA256Hash(ctx context.Context, hash string) (*domain.ProjectAudit, error)
	DeleteAudit(ctx context.Context, id string, userID string) error
}

type auditRepository struct {
	client *db.PrismaClient
}

func NewAuditRepository(client *db.PrismaClient) AuditRepository {
	return &auditRepository{client: client}
}

func (r *auditRepository) CreateAudit(ctx context.Context, audit *domain.ProjectAudit) (*domain.ProjectAudit, error) {
	if audit.UserID == "mock-uuid" {
		// Ensure mock user exists to prevent foreign key constraint error
		_, errUser := r.client.User.FindUnique(
			db.User.ID.Equals("mock-uuid"),
		).Exec(ctx)
		if errUser != nil {
			_, _ = r.client.User.CreateOne(
				db.User.ID.Set("mock-uuid"),
				db.User.Email.Set("mock@example.com"),
				db.User.Name.Set("Mock User"),
			).Exec(ctx)
		}
	}

	fileType := audit.PDDFileType
	if fileType == "" {
		fileType = "pdf"
	}

	created, err := r.client.ProjectAudit.CreateOne(
		db.ProjectAudit.User.Link(db.User.ID.Equals(audit.UserID)),
		db.ProjectAudit.ProjectName.Set(audit.ProjectName),
		db.ProjectAudit.PddFileType.Set(fileType),
		db.ProjectAudit.FeasibilityScore.Set(audit.FeasibilityScore),
		db.ProjectAudit.Sha256Hash.Set(audit.SHA256Hash),
		// Optional fields below
		db.ProjectAudit.TotalPages.Set(audit.TotalPages),
		db.ProjectAudit.TotalWords.Set(audit.TotalWords),
		db.ProjectAudit.TotalSentences.Set(audit.TotalSentences),
		db.ProjectAudit.ScoreLegal.Set(audit.ScoreLegal),
		db.ProjectAudit.ScoreTechnical.Set(audit.ScoreTechnical),
		db.ProjectAudit.ScoreSocial.Set(audit.ScoreSocial),
		db.ProjectAudit.ScoreTransparency.Set(audit.ScoreTransparency),
		db.ProjectAudit.ParsedDocumentJSON.Set([]byte(audit.ParsedDocumentJson)),
		db.ProjectAudit.ID.Set(audit.ID),
		db.ProjectAudit.Status.Set(db.BadgeStatus(audit.Status)),
	).Exec(ctx)
	
	if err != nil {
		return nil, err
	}

	for _, issue := range audit.Issues {
		var prismaSeverity db.AuditSeverity
		switch issue.Severity {
		case "HIGH_RISK":
			prismaSeverity = db.AuditSeverityHighRisk
		case "MEDIUM_RISK":
			prismaSeverity = db.AuditSeverityMediumRisk
		default:
			prismaSeverity = db.AuditSeverityCompliant
		}

		_, err := r.client.AuditIssue.CreateOne(
			db.AuditIssue.Audit.Link(db.ProjectAudit.ID.Equals(created.ID)),
			db.AuditIssue.Severity.Set(prismaSeverity),
			db.AuditIssue.ClauseText.Set(issue.ClauseText),
			db.AuditIssue.MatchedLaw.Set(issue.MatchedLaw),
			db.AuditIssue.OriginalLawText.Set(issue.OriginalLawText),
			db.AuditIssue.SuggestedRevision.Set(issue.SuggestedRevision),
			db.AuditIssue.PageNumber.Set(issue.PageNumber),
			db.AuditIssue.ChunkIndex.Set(issue.ChunkIndex),
		).Exec(ctx)
		if err != nil {
			return nil, err
		}
	}

	return audit, nil
}

func (r *auditRepository) DeleteAudit(ctx context.Context, id string, userID string) error {
	// First check if it exists and belongs to the user
	record, err := r.client.ProjectAudit.FindUnique(
		db.ProjectAudit.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return err
	}
	if record.UserID != userID {
		return context.Canceled // Or any error to denote unauthorized
	}

	_, err = r.client.ProjectAudit.FindUnique(
		db.ProjectAudit.ID.Equals(id),
	).Delete().Exec(ctx)
	
	return err
}

func (r *auditRepository) GetAuditByID(ctx context.Context, id string) (*domain.ProjectAudit, error) {
	record, err := r.client.ProjectAudit.FindUnique(
		db.ProjectAudit.ID.Equals(id),
	).With(
		db.ProjectAudit.Issues.Fetch(),
		db.ProjectAudit.User.Fetch(),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	issues := make([]domain.AuditIssue, len(record.Issues()))
	for i, iss := range record.Issues() {
		issues[i] = domain.AuditIssue{
			ID:                iss.ID,
			AuditID:           iss.AuditID,
			Severity:          domain.RiskSeverity(iss.Severity),
			ClauseText:        iss.ClauseText,
			MatchedLaw:        iss.MatchedLaw,
			OriginalLawText:   iss.OriginalLawText,
			SuggestedRevision: iss.SuggestedRevision,
			CreatedAt:         iss.CreatedAt,
		}
	}

	auditResp := &domain.ProjectAudit{
		ID:                record.ID,
		UserID:            record.UserID,
		ProjectName:       record.ProjectName,
		TotalPages:        record.TotalPages,
		TotalWords:        record.TotalWords,
		TotalSentences:    record.TotalSentences,
		FeasibilityScore:  record.FeasibilityScore,
		ScoreLegal:        record.ScoreLegal,
		ScoreTechnical:    record.ScoreTechnical,
		ScoreSocial:       record.ScoreSocial,
		ScoreTransparency: record.ScoreTransparency,
		SHA256Hash:        record.Sha256Hash,
		Status:            domain.BadgeStatus(record.Status),
		AuthorName:        record.User().Name,
		AuthorEmail:       record.User().Email,
		CreatedAt:         record.CreatedAt,
		Issues:            issues,
	}

	if parsedJson, ok := record.ParsedDocumentJSON(); ok {
		auditResp.ParsedDocumentJson = string(parsedJson)
	}

	return auditResp, nil
}

func (r *auditRepository) GetAuditsByUserID(ctx context.Context, userID string) ([]domain.ProjectAudit, error) {
	records, err := r.client.ProjectAudit.FindMany(
		db.ProjectAudit.UserID.Equals(userID),
	).OrderBy(
		db.ProjectAudit.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	var audits []domain.ProjectAudit
	for _, rec := range records {
		audits = append(audits, domain.ProjectAudit{
			ID:                rec.ID,
			UserID:            rec.UserID,
			ProjectName:       rec.ProjectName,
			TotalPages:        rec.TotalPages,
			TotalWords:        rec.TotalWords,
			TotalSentences:    rec.TotalSentences,
			FeasibilityScore:  rec.FeasibilityScore,
			ScoreLegal:        rec.ScoreLegal,
			ScoreTechnical:    rec.ScoreTechnical,
			ScoreSocial:       rec.ScoreSocial,
			ScoreTransparency: rec.ScoreTransparency,
			SHA256Hash:        rec.Sha256Hash,
			Status:            domain.BadgeStatus(rec.Status),
			CreatedAt:         rec.CreatedAt,
		})
	}
	return audits, nil
}

func (r *auditRepository) GetAuditBySHA256Hash(ctx context.Context, hash string) (*domain.ProjectAudit, error) {
	record, err := r.client.ProjectAudit.FindUnique(
		db.ProjectAudit.Sha256Hash.Equals(hash),
	).With(
		db.ProjectAudit.User.Fetch(),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &domain.ProjectAudit{
		ID:                record.ID,
		UserID:            record.UserID,
		ProjectName:       record.ProjectName,
		FeasibilityScore:  record.FeasibilityScore,
		ScoreLegal:        record.ScoreLegal,
		ScoreTechnical:    record.ScoreTechnical,
		ScoreSocial:       record.ScoreSocial,
		ScoreTransparency: record.ScoreTransparency,
		SHA256Hash:        record.Sha256Hash,
		Status:            domain.BadgeStatus(record.Status),
		AuthorName:        record.User().Name,
		AuthorEmail:       record.User().Email,
		CreatedAt:         record.CreatedAt,
	}, nil
}
