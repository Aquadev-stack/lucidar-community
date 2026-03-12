package handlers

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"server/config"
	"server/models"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// Minimal Author Response - only send what's needed
type AuthorResponse struct {
	ID           uint   `json:"id"`
	Username     string `json:"username"`
	DisplayName  string `json:"display_name"`
	Avatar       string `json:"avatar,omitempty"`
	PrimaryColor string `json:"primary_color"`
	VerifiedType string `json:"verified_type,omitempty"`
	IsPro        bool   `json:"is_pro"`
}

// Minimal Post Response - omits empty fields to save data
type PostResponse struct {
	ID         uint           `json:"id"`
	Content    string         `json:"content"`
	MediaURL   string         `json:"media_url,omitempty"`
	MediaType  string         `json:"media_type,omitempty"`
	Likes      int64          `json:"likes"`
	Comments   int            `json:"comments"`
	Shares     int            `json:"shares"`
	CreatedAt  time.Time      `json:"created_at"`
	Tags       []string       `json:"tags,omitempty"`
	IsLiked    bool           `json:"is_liked"`
	IsPinned   bool           `json:"is_pinned"`
	AuthorID   uint           `json:"author_id"`
	Author     AuthorResponse `json:"author"`
}

// GetFeed - OPTIMIZED with pagination, preloading, and batch queries
func GetFeed(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	// PAGINATION - Only load 10 posts at a time (saves massive data)
	page := c.QueryInt("page", 1)
	limit := c.QueryInt("limit", 10) // Reduced from 50 to 10
	
	if limit > 20 { // Hard cap at 20
		limit = 20
	}
	if page < 1 {
		page = 1
	}
	offset := (page - 1) * limit
	
	// SINGLE QUERY with Preload - no N+1 problem
	var posts []models.Post
	result := config.DB.
		Preload("User", func(db *gorm.DB) *gorm.DB {
			// Only select fields we need - saves data
			return db.Select("id", "username", "display_name", "avatar", 
				"primary_color", "verified_type", "is_pro", "pro_expires_at")
		}).
		Order("is_pinned DESC, created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&posts)
	
	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch posts"})
	}
	
	// Early return if no posts
	if len(posts) == 0 {
		return c.JSON(fiber.Map{
			"posts": []interface{}{},
			"page": page,
			"has_more": false,
		})
	}
	
	// Collect all post IDs for batch operations
	postIDs := make([]uint, len(posts))
	for i, p := range posts {
		postIDs[i] = p.ID
	}
	
	// BATCH: Get all likes by current user in ONE query
	userLikes := make(map[uint]bool)
	var likes []models.Like
	config.DB.
		Select("post_id").
		Where("user_id = ? AND post_id IN ?", userID, postIDs).
		Find(&likes)
	for _, l := range likes {
		userLikes[l.PostID] = true
	}
	
	// BATCH: Get all like counts in ONE query
	likeCounts := make(map[uint]int64)
	var countResults []struct {
		PostID uint
		Count  int64
	}
	config.DB.Model(&models.Like{}).
		Select("post_id, COUNT(*) as count").
		Where("post_id IN ?", postIDs).
		Group("post_id").
		Scan(&countResults)
	for _, r := range countResults {
		likeCounts[r.PostID] = r.Count
	}
	
	// Build response
	response := make([]PostResponse, 0, len(posts))
	for _, post := range posts {
		author := post.User
		
		// Check pro status
		isPro := author.IsPro && author.ProExpiresAt != nil && 
			author.ProExpiresAt.After(time.Now())
		
		// Determine media URL (only one field instead of separate image/video)
		mediaURL := ""
		if post.MediaType == "video" && post.Video != "" {
			mediaURL = post.Video
		} else if post.Image != "" {
			mediaURL = post.Image
		}
		
		// Parse tags only if present (saves CPU)
		var tags []string
		if post.Tags != "" {
			tags = parseTags(post.Tags)
		}
		
		response = append(response, PostResponse{
			ID:        post.ID,
			Content:   post.Content,
			MediaURL:  mediaURL,
			MediaType: post.MediaType,
			Likes:     likeCounts[post.ID],
			Comments:  post.Comments,
			Shares:    post.Shares,
			CreatedAt: post.CreatedAt,
			Tags:      tags,
			IsLiked:   userLikes[post.ID],
			IsPinned:  post.IsPinned,
			AuthorID:  post.UserID,
			Author: AuthorResponse{
				ID:           author.ID,
				Username:     author.Username,
				DisplayName:  author.DisplayName,
				Avatar:       author.Avatar,
				PrimaryColor: author.PrimaryColor,
				VerifiedType: author.VerifiedType,
				IsPro:        isPro,
			},
		})
	}
	
	return c.JSON(fiber.Map{
		"posts":    response,
		"page":     page,
		"has_more": len(posts) == limit, // True if there might be more
	})
}

// CreatePost - Optimized to return minimal data
func CreatePost(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	content := c.FormValue("content")
	tags := c.FormValue("tags")
	
	// Handle file upload
	file, err := c.FormFile("media")
	var mediaURL, mediaType string
	
	if err == nil && file != nil {
		// Validate size (max 10MB to save bandwidth)
		if file.Size > 10*1024*1024 {
			return c.Status(400).JSON(fiber.Map{"error": "File too large. Max 10MB"})
		}
		
		// Detect type from extension
		ext := strings.ToLower(filepath.Ext(file.Filename))
		if ext == ".mp4" || ext == ".webm" || ext == ".mov" {
			mediaType = "video"
		} else {
			mediaType = "image"
		}
		
		// Save file
		filename := fmt.Sprintf("%d_%d%s", userID.(uint), time.Now().Unix(), ext)
		mediaURL = "/uploads/" + filename
		
		if err := c.SaveFile(file, "./uploads/"+filename); err != nil {
			return c.Status(500).JSON(fiber.Map{"error": "Failed to save file"})
		}
	}
	
	// Create post
	post := models.Post{
		UserID:    userID.(uint),
		Content:   content,
		Tags:      tags,
		MediaType: mediaType,
	}
	
	if mediaType == "video" {
		post.Video = mediaURL
	} else if mediaType == "image" {
		post.Image = mediaURL
	}
	
	if result := config.DB.Create(&post); result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to create post"})
	}
	
	// Return minimal response - don't reload entire feed
	return c.Status(201).JSON(fiber.Map{
		"success": true,
		"post": fiber.Map{
			"id":         post.ID,
			"content":    post.Content,
			"media_url":  mediaURL,
			"media_type": mediaType,
			"created_at": post.CreatedAt,
		},
	})
}

// DeletePost
func DeletePost(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	postID := c.Params("id")
	
	var post models.Post
	if result := config.DB.First(&post, postID); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	
	if post.UserID != userID.(uint) {
		return c.Status(403).JSON(fiber.Map{"error": "Not authorized"})
	}
	
	// Delete in transaction
	config.DB.Transaction(func(tx *gorm.DB) error {
		tx.Where("post_id = ?", post.ID).Delete(&models.Like{})
		tx.Delete(&post)
		return nil
	})
	
	return c.JSON(fiber.Map{"success": true, "message": "Deleted"})
}

// TogglePinPost
func TogglePinPost(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	postID := c.Params("id")
	
	var post models.Post
	if result := config.DB.First(&post, postID); result.Error != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	
	if post.UserID != userID.(uint) {
		return c.Status(403).JSON(fiber.Map{"error": "Not authorized"})
	}
	
	// If pinning, unpin all others first
	if !post.IsPinned {
		config.DB.Model(&models.Post{}).
			Where("user_id = ? AND is_pinned = ?", userID, true).
			Update("is_pinned", false)
	}
	
	post.IsPinned = !post.IsPinned
	config.DB.Save(&post)
	
	return c.JSON(fiber.Map{
		"success":   true,
		"is_pinned": post.IsPinned,
	})
}

// ToggleLike - Optimized
func ToggleLike(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	postIDStr := c.Params("id")
	var postID uint
	fmt.Sscanf(postIDStr, "%d", &postID)
	
	// Check if exists
	var like models.Like
	result := config.DB.Where("user_id = ? AND post_id = ?", userID, postID).First(&like)
	
	if result.Error != nil {
		// Create like
		like = models.Like{
			UserID: userID.(uint),
			PostID: postID,
		}
		config.DB.Create(&like)
		return c.JSON(fiber.Map{"liked": true})
	}
	
	// Delete like
	config.DB.Delete(&like)
	return c.JSON(fiber.Map{"liked": false})
}

// SharePost - Just increment counter
func SharePost(c *fiber.Ctx) error {
	postID := c.Params("id")
	
	result := config.DB.Model(&models.Post{}).
		Where("id = ?", postID).
		Update("shares", gorm.Expr("shares + 1"))
	
	if result.RowsAffected == 0 {
		return c.Status(404).JSON(fiber.Map{"error": "Post not found"})
	}
	
	return c.JSON(fiber.Map{"success": true})
}

// GetTrending - Cached for 5 minutes to save queries
var trendingCache struct {
	data      interface{}
	timestamp time.Time
}

func GetTrending(c *fiber.Ctx) error {
	// Return cached if fresh (5 min cache)
	if time.Since(trendingCache.timestamp) < 5*time.Minute && trendingCache.data != nil {
		return c.JSON(trendingCache.data)
	}
	
	var tags []models.Tag
	config.DB.Order("post_count DESC").Limit(5).Find(&tags)
	
	response := fiber.Map{"tags": tags}
	trendingCache.data = response
	trendingCache.timestamp = time.Now()
	
	return c.JSON(response)
}

// GetSuggestions - Limited and cached
func GetSuggestions(c *fiber.Ctx) error {
	userID := c.Locals("user_id")
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	
	var users []models.User
	config.DB.
		Where("id != ?", userID).
		Order("followers DESC").
		Limit(3). // Only 3 suggestions
		Select("id", "username", "display_name", "avatar", "is_pro", "pro_expires_at", "followers").
		Find(&users)
	
	response := make([]fiber.Map, 0, len(users))
	for _, u := range users {
		isPro := u.IsPro && u.ProExpiresAt != nil && u.ProExpiresAt.After(time.Now())
		response = append(response, fiber.Map{
			"id":          u.ID,
			"username":    u.Username,
			"display_name": u.DisplayName,
			"avatar":      u.Avatar,
			"is_pro":      isPro,
			"followers":   u.Followers,
		})
	}
	
	return c.JSON(fiber.Map{"users": response})
}

// GetNotifications - Minimal response
func GetNotifications(c *fiber.Ctx) error {
	// Return empty for now - implement later with caching
	return c.JSON(fiber.Map{
		"notifications": []interface{}{},
		"unread_count":  0,
	})
}

// Helper functions
func parseTags(tags string) []string {
	if tags == "" {
		return nil // Return nil instead of empty array (saves bytes)
	}
	
	var result []string
	if err := json.Unmarshal([]byte(tags), &result); err == nil {
		return result
	}
	
	// Fallback
	parts := strings.Split(tags, ",")
	for i, tag := range parts {
		parts[i] = strings.TrimSpace(strings.Trim(tag, "[]\"'"))
	}
	return parts
}