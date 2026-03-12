package models

import (
	"time"
)

type Post struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
	
	UserID     uint      `json:"user_id" gorm:"index:idx_user_created"`
	User       User      `json:"-" gorm:"foreignKey:UserID"` // For Preload
	
	Content    string    `json:"content"`
	Image      string    `json:"image,omitempty"`        // omitempty saves data
	Video      string    `json:"video,omitempty"`        // omitempty saves data
	MediaType  string    `json:"media_type,omitempty"`   // omitempty saves data
	Tags       string    `json:"tags,omitempty"`         // omitempty saves data
	Comments   int       `json:"comments" gorm:"default:0"`
	Shares     int       `json:"shares" gorm:"default:0"`
	IsPinned   bool      `json:"is_pinned" gorm:"default:false;index:idx_pinned_created"`
}

// TableName ensures proper indexing
func (Post) TableName() string {
	return "posts"
}