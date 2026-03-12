package handlers

import (
	"time"
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gofiber/fiber/v2"
	"server/config"
	"server/models"
)

var jwtSecret = []byte("lucidar_jwt_secret_change_this_in_production")

// HashPassword hashes the password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash compares password with hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateJWT creates a new JWT token for a user
func GenerateJWT(userID uint) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
	})
	return token.SignedString(jwtSecret)
}

func Login(c *fiber.Ctx) error {
	var input models.LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	var user models.User
	config.DB.Where("email = ?", input.Email).First(&user)
	if user.ID == 0 {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	if !CheckPasswordHash(input.Password, user.Password) {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Generate REAL JWT token
	token, err := GenerateJWT(user.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":            user.ID,
			"username":      user.Username,
			"email":         user.Email,
			"display_name":  user.DisplayName,
			"primary_color": user.PrimaryColor,
			"accent_color":  user.AccentColor,
			"level":         user.Level,
			"lucid_points":  user.LucidPoints,
			"avatar":        user.Avatar,
			"cover_photo":   user.CoverPhoto,
			"decoration":    user.Decoration,
			"font":          user.Font,
			"effect":        user.Effect,
			"bio":           user.Bio,
			"location":      user.Location,
			"website":       user.Website,
		},
	})
}

func Register(c *fiber.Ctx) error {
	var input models.RegisterInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Check existing email
	var existingUser models.User
	config.DB.Where("email = ?", input.Email).First(&existingUser)
	if existingUser.ID != 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Email already registered"})
	}

	// Check existing username
	config.DB.Where("username = ?", input.Username).First(&existingUser)
	if existingUser.ID != 0 {
		return c.Status(400).JSON(fiber.Map{"error": "Username taken"})
	}

	hashedPassword, err := HashPassword(input.Password)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	user := models.User{
		Username:     input.Username,
		Email:        input.Email,
		Password:     hashedPassword,
		DisplayName:  input.Username,
		PrimaryColor: "#ccff00",
		AccentColor:  "#00ff88",
		Font:         "default",
		Effect:       "solid",
		Decoration:   "none",
		Level:        1,
		LucidPoints:  100,
		Badges:       `["early_adopter"]`,
	}

	config.DB.Create(&user)

	// Generate token for new user
	token, err := GenerateJWT(user.ID)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	// Return token so frontend can auto-login
	return c.Status(201).JSON(fiber.Map{
		"token": token,
		"user": fiber.Map{
			"id":            user.ID,
			"username":      user.Username,
			"email":         user.Email,
			"display_name":  user.DisplayName,
			"primary_color": user.PrimaryColor,
			"accent_color":  user.AccentColor,
			"level":         user.Level,
			"lucid_points":  user.LucidPoints,
			"avatar":        user.Avatar,
			"cover_photo":   user.CoverPhoto,
			"decoration":    user.Decoration,
			"font":          user.Font,
			"effect":        user.Effect,
			"bio":           user.Bio,
			"location":      user.Location,
			"website":       user.Website,
		},
	})
}