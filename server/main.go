package main

import (
	"server/config"
	"server/routes"
	"server/models"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	godotenv.Load()

	// Connect to database
	config.ConnectDB()

	// Auto-create tables from models
	config.DB.AutoMigrate(&models.User{})

	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New()) // Log requests to console
	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173", // Your React dev server
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// Setup routes
	routes.SetupRoutes(app)

	// Start server
	app.Listen(":3000")
}