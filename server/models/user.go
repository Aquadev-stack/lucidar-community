// models/user.go - Complete User model with Pro system
package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	
	// Auth
	Username  string         `gorm:"uniqueIndex;not null" json:"username"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	
	// Profile
	DisplayName   string    `json:"display_name"`
	Bio           string    `json:"bio"`
	Avatar        string    `json:"avatar"`
	CoverPhoto    string    `json:"cover_photo"`
	Location      string    `json:"location"`
	Website       string    `json:"website"`
	
	// Customization
	Decoration    string    `json:"decoration"`
	PrimaryColor  string    `json:"primary_color" gorm:"default:#ccff00"`
	AccentColor   string    `json:"accent_color" gorm:"default:#00ff88"`
	Font          string    `json:"font" gorm:"default:default"`
	Effect        string    `json:"effect" gorm:"default:solid"`
	
	// Badges - stored as JSON array
	Badges        string    `json:"badges" gorm:"type:json;default:'[\"early_adopter\"]'"`
	
	// XP & Progress
	Level         int       `json:"level" gorm:"default:1"`
	CurrentXP     int       `json:"current_xp" gorm:"default:0"`
	TotalXP       int       `json:"total_xp" gorm:"default:0"`
	
	// Currency
	LucidPoints   int       `json:"lucid_points" gorm:"default:100"`
	
	// Stats
	Followers     int       `json:"followers" gorm:"default:0"`
	Following     int       `json:"following" gorm:"default:0"`
	Trades        int       `json:"trades" gorm:"default:0"`
	Reputation    float64   `json:"reputation" gorm:"default:100"`
	
	// Status
	IsVerified    bool      `json:"is_verified" gorm:"default:false"`
	VerifiedType  string    `json:"verified_type" gorm:"default:''"`  // NEW: "normal", "golden", etc.
	LastActive    time.Time `json:"last_active"`
	
	// Pro System - NEW FIELDS
	IsPro         bool       `json:"is_pro" gorm:"default:false"`
	ProExpiresAt  *time.Time `json:"pro_expires_at"`  // Pointer to allow null
}

type RegisterInput struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ProfileUpdateInput struct {
	DisplayName   string `json:"display_name"`
	Bio           string `json:"bio"`
	Location      string `json:"location"`
	Website       string `json:"website"`
	Avatar        string `json:"avatar"`
	CoverPhoto    string `json:"cover_photo"`
	Decoration    string `json:"decoration"`
	PrimaryColor  string `json:"primary_color"`
	AccentColor   string `json:"accent_color"`
	Font          string `json:"font"`
	Effect        string `json:"effect"`
	Badges        string `json:"badges"` // JSON string
}