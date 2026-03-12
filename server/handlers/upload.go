package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// UploadImage handles avatar and cover photo uploads
func UploadImage(c *fiber.Ctx) error {
	// Get user from context (set by auth middleware)
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}

	// Get file from request
	file, err := c.FormFile("image")
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "No image provided"})
	}

	// Validate file type
	allowedTypes := []string{"image/jpeg", "image/png", "image/gif", "image/webp"}
	isValid := false
	for _, t := range allowedTypes {
		if file.Header.Get("Content-Type") == t {
			isValid = true
			break
		}
	}
	if !isValid {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid file type. Only JPEG, PNG, GIF, WebP allowed"})
	}

	// Validate file size (max 5MB)
	if file.Size > 5*1024*1024 {
		return c.Status(400).JSON(fiber.Map{"error": "File too large. Max 5MB"})
	}

	// Create uploads directory if not exists
	uploadDir := "./uploads"
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.MkdirAll(uploadDir, 0755)
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s_%s%s", uuid.New().String(), time.Now().Format("20060102"), ext)
	filepath := filepath.Join(uploadDir, filename)

	// Save file
	if err := c.SaveFile(file, filepath); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
	}

	// Return URL (adjust for your setup)
	imageURL := fmt.Sprintf("/uploads/%s", filename)

	return c.JSON(fiber.Map{
		"success": true,
		"url":     imageURL,
		"filename": filename,
	})
}