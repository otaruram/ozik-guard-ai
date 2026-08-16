package domain

import "time"

type User struct {
	ID               string    `json:"id"`
	Email            string    `json:"email"`
	Name             string    `json:"name"`
	AvatarURL        *string   `json:"avatarUrl,omitempty"`
	Company          *string   `json:"company,omitempty"`
	Provider         string    `json:"provider"`
	CreditsBalance   int       `json:"creditsBalance"`
	APIKey           *string   `json:"apiKey,omitempty"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	NotifyReportDone bool      `json:"notifyReportDone"`
	NotifyRegulation bool      `json:"notifyRegulation"`
	Role             string    `json:"role"`
	IsBanned         bool      `json:"isBanned"`
}

type UpdateProfileRequest struct {
	Name    string  `json:"name"`
	Company *string `json:"company,omitempty"`
}

type UpdateNotificationRequest struct {
	NotifyReportDone bool `json:"notifyReportDone"`
	NotifyRegulation bool `json:"notifyRegulation"`
}

type UserMeResponse struct {
	ID               string  `json:"id"`
	Email            string  `json:"email"`
	Name             string  `json:"name"`
	AvatarURL        *string `json:"avatarUrl,omitempty"`
	Company          *string `json:"company,omitempty"`
	Provider         string  `json:"provider"`
	CreditsBalance   int     `json:"creditsBalance"`
	APIKey           *string `json:"apiKey,omitempty"`
	NotifyReportDone bool    `json:"notifyReportDone"`
	NotifyRegulation bool    `json:"notifyRegulation"`
}
