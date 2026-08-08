package repository

import (
	"context"
	"ozikcarbon-backend/domain"
	"ozikcarbon-backend/prisma/db"
)

type UserRepository interface {
	GetByID(ctx context.Context, id string) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	UpsertFromGoogle(ctx context.Context, user *domain.User) (*domain.User, error)
	UpdateProfile(ctx context.Context, id string, req *domain.UpdateProfileRequest) (*domain.User, error)
	DeductCredit(ctx context.Context, id string) error
	GetCreditsBalance(ctx context.Context, id string) (int, error)
}

type userRepository struct {
	client *db.PrismaClient
}

func NewUserRepository(client *db.PrismaClient) UserRepository {
	return &userRepository{client: client}
}

func (r *userRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	record, err := r.client.User.FindUnique(
		db.User.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &domain.User{
		ID:             record.ID,
		Email:          record.Email,
		Name:           record.Name,
		Provider:       record.Provider,
		CreditsBalance: record.CreditsBalance,
	}, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	record, err := r.client.User.FindUnique(
		db.User.Email.Equals(email),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &domain.User{
		ID:             record.ID,
		Email:          record.Email,
		Name:           record.Name,
		Provider:       record.Provider,
		CreditsBalance: record.CreditsBalance,
	}, nil
}

func (r *userRepository) UpsertFromGoogle(ctx context.Context, user *domain.User) (*domain.User, error) {
	record, err := r.client.User.UpsertOne(
		db.User.Email.Equals(user.Email),
	).Create(
		db.User.ID.Set(user.ID),
		db.User.Email.Set(user.Email),
		db.User.Name.Set(user.Name),
		db.User.Provider.Set(user.Provider),
	).Update(
		db.User.Name.Set(user.Name),
		db.User.Provider.Set(user.Provider),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	user.ID = record.ID
	user.CreditsBalance = record.CreditsBalance
	return user, nil
}

func (r *userRepository) UpdateProfile(ctx context.Context, id string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	var company string
	if req.Company != nil {
		company = *req.Company
	}
	record, err := r.client.User.FindUnique(
		db.User.ID.Equals(id),
	).Update(
		db.User.Name.Set(req.Name),
		db.User.Company.Set(company),
	).Exec(ctx)
	if err != nil {
		return nil, err
	}

	return &domain.User{
		ID:    record.ID,
		Name:  record.Name,
		Email: record.Email,
	}, nil
}

func (r *userRepository) DeductCredit(ctx context.Context, id string) error {
	_, err := r.client.User.FindUnique(
		db.User.ID.Equals(id),
	).Update(
		db.User.CreditsBalance.Decrement(1),
	).Exec(ctx)
	return err
}

func (r *userRepository) GetCreditsBalance(ctx context.Context, id string) (int, error) {
	record, err := r.client.User.FindUnique(
		db.User.ID.Equals(id),
	).Exec(ctx)
	if err != nil {
		return 0, err
	}
	return record.CreditsBalance, nil
}
