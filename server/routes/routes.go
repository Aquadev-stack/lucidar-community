package routes

import (
	"server/handlers"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Post("/login", handlers.Login)
	api.Post("/register", handlers.Register)
}