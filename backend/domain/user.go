package domain

import "time"

type User struct {
	ID             string    `json:"id"`
	Email          string    `json:"email"`
	Name           string    `json:"name"`
	AvatarURL      *string   `json:"avatarUrl,omitempty"`
	Company        *string   `json:"company,omitempty"`
	Provider       string    `json:"provider"`
	CreditsBalance int       `json:"creditsBalance"`
	APIKey         *string   `json:"apiKey,omitempty"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type UpdateProfileRequest struct {
	Name    string  `json:"name"`
	Company *string `json:"company,omitempty"`
}

type UserMeResponse struct {
	ID             string  `json:"id"`
	Email          string  `json:"email"`
	Name           string  `json:"name"`
	AvatarURL      *string `json:"avatarUrl,omitempty"`
	Company        *string `json:"company,omitempty"`
	Provider       string  `json:"provider"`
	CreditsBalance int     `json:"creditsBalance"`
	APIKey         *string `json:"apiKey,omitempty"`
}
