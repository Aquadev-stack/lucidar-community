package handlers

import (
	"server/config"
	"server/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetProfile(c *fiber.Ctx) error {
	username := c.Params("username")
	
	var user models.User
	result := config.DB.Where("username = ?", username).First(&user)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	
	// Calculate pro status
	isProActive := user.IsPro && user.ProExpiresAt != nil && user.ProExpiresAt.After(time.Now())
	
	// Count user's posts
	var postsCount int64
	config.DB.Model(&models.Post{}).Where("user_id = ?", user.ID).Count(&postsCount)
	
	// Count total likes received
	var likesReceived int64
	config.DB.Table("likes").
		Joins("JOIN posts ON likes.post_id = posts.id").
		Where("posts.user_id = ?", user.ID).
		Count(&likesReceived)
	
	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":             user.ID,
			"username":       user.Username,
			"display_name":   user.DisplayName,
			"bio":            user.Bio,
			"avatar":         user.Avatar,
			"cover_photo":    user.CoverPhoto,
			"location":       user.Location,
			"website":        user.Website,
			"primary_color":  user.PrimaryColor,
			"accent_color":   user.AccentColor,
			"font":           user.Font,
			"effect":         user.Effect,
			"decoration":     user.Decoration,
			"badges":         user.Badges,
			"level":          user.Level,
			"current_xp":     user.CurrentXP,
			"lucid_points":   user.LucidPoints,
			"followers":      user.Followers,
			"following":      user.Following,
			"is_verified":    user.IsVerified,
			"verified_type":  user.VerifiedType,
			"is_pro":         isProActive,
			"pro_expires_at": user.ProExpiresAt,
			"created_at":     user.CreatedAt,
			"posts_count":    postsCount,      // NEW
			"likes_received": likesReceived,   // NEW
		},
	})
}

func GetMyProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	var user models.User
	result := config.DB.First(&user, userID)
	if result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}
	
	// Calculate pro status and days remaining
	isProActive := user.IsPro && user.ProExpiresAt != nil && user.ProExpiresAt.After(time.Now())
	var proDaysRemaining int
	if isProActive && user.ProExpiresAt != nil {
		proDaysRemaining = int(user.ProExpiresAt.Sub(time.Now()).Hours() / 24)
	}
	
	// Count user's posts
	var postsCount int64
	config.DB.Model(&models.Post{}).Where("user_id = ?", user.ID).Count(&postsCount)
	
	// Count total likes received
	var likesReceived int64
	config.DB.Table("likes").
		Joins("JOIN posts ON likes.post_id = posts.id").
		Where("posts.user_id = ?", user.ID).
		Count(&likesReceived)
	
	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":                 user.ID,
			"username":           user.Username,
			"email":              user.Email,
			"display_name":       user.DisplayName,
			"bio":                user.Bio,
			"avatar":             user.Avatar,
			"cover_photo":        user.CoverPhoto,
			"location":           user.Location,
			"website":            user.Website,
			"primary_color":      user.PrimaryColor,
			"accent_color":       user.AccentColor,
			"font":               user.Font,
			"effect":             user.Effect,
			"decoration":         user.Decoration,
			"badges":             user.Badges,
			"level":              user.Level,
			"current_xp":         user.CurrentXP,
			"lucid_points":       user.LucidPoints,
			"followers":          user.Followers,
			"following":          user.Following,
			"reputation":         user.Reputation,
			"is_verified":        user.IsVerified,
			"verified_type":      user.VerifiedType,
			"is_pro":             isProActive,
			"pro_expires_at":     user.ProExpiresAt,
			"pro_days_remaining": proDaysRemaining, // NEW
			"created_at":         user.CreatedAt,
			"posts_count":        postsCount,        // NEW
			"likes_received":     likesReceived,     // NEW
		},
	})
}

func UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	var input models.ProfileUpdateInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}
	
	var user models.User
	config.DB.First(&user, userID)
	
	// Update fields
	if input.DisplayName != "" {
		user.DisplayName = input.DisplayName
	}
	if input.Bio != "" {
		user.Bio = input.Bio
	}
	if input.Location != "" {
		user.Location = input.Location
	}
	if input.Website != "" {
		user.Website = input.Website
	}
	if input.Avatar != "" {
		user.Avatar = input.Avatar
	}
	if input.CoverPhoto != "" {
		user.CoverPhoto = input.CoverPhoto
	}
	if input.Decoration != "" {
		user.Decoration = input.Decoration
	}
	if input.PrimaryColor != "" {
		user.PrimaryColor = input.PrimaryColor
	}
	if input.AccentColor != "" {
		user.AccentColor = input.AccentColor
	}
	if input.Font != "" {
		user.Font = input.Font
	}
	if input.Effect != "" {
		user.Effect = input.Effect
	}
	
	config.DB.Save(&user)
	
	return c.JSON(fiber.Map{
		"message": "Profile updated",
		"user": fiber.Map{
			"id":            user.ID,
			"username":      user.Username,
			"display_name":  user.DisplayName,
			"bio":           user.Bio,
			"avatar":        user.Avatar,
			"cover_photo":   user.CoverPhoto,
			"location":      user.Location,
			"website":       user.Website,
			"primary_color": user.PrimaryColor,
			"accent_color":  user.AccentColor,
			"font":          user.Font,
			"effect":        user.Effect,
			"decoration":    user.Decoration,
		},
	})
}