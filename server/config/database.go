package config

import (
	"fmt"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	// get env var
	databaseURL := os.Getenv("DATABASE_URL")
	// connect to postgres
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database:" + err.Error())
	}
	// store in DB variable
	DB = db
	// print success or panic on error
	fmt.Println("Database connected successfully")
}