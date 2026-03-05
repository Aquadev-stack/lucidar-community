package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Username  string         `gorm:"uniqueIndex;not null" json:"username"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"`
	Avatar    string         `json:"avatar"`
	CoverPhoto    string     `json:"cover_photo"`
	Decoration    string     `json:"decoration"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time     `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type RegisterInput struct {
	Username string `json:"username" validate:"required,min=3,max=30"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type LoginInput struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UpdateProfileInput struct {
	Username   *string `json:"username,omitempty" validate:"omitempty,min=3,max=30"`
	Avatar     *string `json:"avatar,omitempty"`
	CoverPhoto *string `json:"cover_photo,omitempty"`
	Decoration *string `json:"decoration,omitempty"`
}