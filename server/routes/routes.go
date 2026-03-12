package routes

import (
	"server/handlers"
	"server/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth
	api.Post("/login", handlers.Login)
	api.Post("/register", handlers.Register)
	
	// Profile
	api.Get("/profile/:username", handlers.GetProfile)
	api.Get("/me", middleware.AuthRequired(), handlers.GetMyProfile)
	api.Put("/profile", middleware.AuthRequired(), handlers.UpdateProfile)
	api.Post("/upload", middleware.AuthRequired(), handlers.UploadImage)
	
	// Feed & Posts
	api.Get("/feed", middleware.AuthRequired(), handlers.GetFeed)
	api.Post("/posts", middleware.AuthRequired(), handlers.CreatePost)
	api.Delete("/posts/:id", middleware.AuthRequired(), handlers.DeletePost)      // NEW
	api.Post("/posts/:id/pin", middleware.AuthRequired(), handlers.TogglePinPost) // NEW
	api.Post("/posts/:id/share", handlers.SharePost)                                // NEW
	
	// Likes
	api.Post("/posts/:id/like", middleware.AuthRequired(), handlers.ToggleLike)
	api.Delete("/posts/:id/like", middleware.AuthRequired(), handlers.ToggleLike)
	
	// Discover
	api.Get("/trending", handlers.GetTrending)
	api.Get("/suggestions", middleware.AuthRequired(), handlers.GetSuggestions)
	
	// Notifications
	api.Get("/notifications", middleware.AuthRequired(), handlers.GetNotifications)
	
	// Pro System (placeholder for future implementation)
	// api.Post("/upgrade-pro", middleware.AuthRequired(), handlers.UpgradeToPro)
	// api.Get("/market/items", middleware.AuthRequired(), handlers.GetMarketItems)
	// api.Post("/market/purchase", middleware.AuthRequired(), handlers.PurchaseItem)
}