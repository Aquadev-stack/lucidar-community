package models

import "time"

type Like struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	PostID    uint      `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}