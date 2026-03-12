package models

type Tag struct {
	Name      string `json:"name" gorm:"primaryKey"`
	PostCount int    `json:"post_count" gorm:"default:0"`
}