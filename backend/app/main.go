package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"subscrive-app/jwt"
)

type User struct {
	ID                uint   `gorm:"primary_key"`
	UserName          string `gorm:"unique;not null"`
	EncryptedPassword string `gorm:"not null"`
}

type Subscription struct {
	ID        uint   `gorm:"primary_key"`
	UserId    uint   `gorm:"not null;index;foreignKey:UserId;references:ID"`
	AppName   string `gorm:"not null"`
	Price     int    `gorm:"not null"`
	Interval  string `gorm:"not null"`
	Payment   int
	Period    int
	StartDate time.Time
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello world")
}

func main() {
	// DBのセットアップ
	dsn := fmt.Sprintf("%s:%s@tcp(db:3306)/%s",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_DATABASE"),
	)
	// db, err := sql.Open("mysql", dsn)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		fmt.Println("Failed to connect to database:", err)
		return
	}
	db.AutoMigrate(&User{})
	db.AutoMigrate(&Subscription{})
	fmt.Println("Successfully connected to database")

	// 鍵発行してみる
	key := jwt.GenerateToken(1, 1)
	// verifyしてみる
	id, err := jwt.VerifyToken(key)
	if err != nil {
		fmt.Println("Failed to verify token:", err)
	}
	fmt.Println("user_id:", id)

	http.HandleFunc("/", helloHandler)
	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Println("Server failed:", err)
	}
}
