package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
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
	StartDate time.Time `gorm:"type:datetime"`
	Url       string
}

var db *gorm.DB

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func registerHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}
	hashedPassword, err := hashPassword(user.EncryptedPassword)
	if err != nil {
		http.Error(w, `{"error": "Error hashing password"}`, http.StatusInternalServerError)
		return
	}
	user.EncryptedPassword = hashedPassword
	if err := db.Create(&user).Error; err != nil {
		http.Error(w, `{"error": "Error creating user"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "User created successfully"})
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	var input struct {
		UserName          string `json:"UserName"`
		EncryptedPassword string `json:"EncryptedPassword"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}
	if err := db.Where("user_name = ?", input.UserName).First(&user).Error; err != nil {
		http.Error(w, `{"error": "User not found"}`, http.StatusUnauthorized)
		return
	}
	if !checkPasswordHash(input.EncryptedPassword, user.EncryptedPassword) {
		http.Error(w, `{"error": "Invalid password"}`, http.StatusUnauthorized)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Login successful",
		"success": "true",
		"user":    user.UserName,
		"userID":  fmt.Sprintf("%d", user.ID),
	})
}

func getAllSubscriptionsHandler(w http.ResponseWriter, r *http.Request) {
	userIdStr := r.URL.Query().Get("user_id")
	if userIdStr == "" {
		http.Error(w, `{"error": "User ID is required"}`, http.StatusBadRequest)
		return
	}
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		http.Error(w, `{"error": "Invalid User ID"}`, http.StatusBadRequest)
		return
	}

	var subscriptions []Subscription
	if err := db.Where("user_id = ?", userId).Find(&subscriptions).Error; err != nil {
		fmt.Printf("Error fetching subscriptions: %v\n", err)
		http.Error(w, fmt.Sprintf(`{"error": "Error fetching subscriptions: %v"}`, err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscriptions)
}

func getSubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/app/"):])
	if err != nil {
		http.Error(w, `{"error": "Invalid subscription ID"}`, http.StatusBadRequest)
		return
	}
	var subscription Subscription
	if err := db.First(&subscription, id).Error; err != nil {
		http.Error(w, `{"error": "Subscription not found"}`, http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscription)
}

func addSubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	var subscription Subscription
	if err := json.NewDecoder(r.Body).Decode(&subscription); err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}
	if subscription.Url == "" {
		http.Error(w, `{"error": "Url is required"}`, http.StatusBadRequest)
		return
	}
	if subscription.StartDate.IsZero() {
		subscription.StartDate = time.Now()
	}
	if err := db.Create(&subscription).Error; err != nil {
		fmt.Printf("Error creating subscription: %v\n", err)
		http.Error(w, fmt.Sprintf(`{"error": "Error creating subscription: %v"}`, err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Subscription created successfully"})
}

func updateSubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/app/update/"):])
	if err != nil {
		http.Error(w, `{"error": "Invalid subscription ID"}`, http.StatusBadRequest)
		return
	}
	var subscription Subscription
	if err := db.First(&subscription, id).Error; err != nil {
		http.Error(w, `{"error": "Subscription not found"}`, http.StatusNotFound)
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&subscription); err != nil {
		http.Error(w, `{"error": "Invalid request payload"}`, http.StatusBadRequest)
		return
	}

	if subscription.Url == "" {
		http.Error(w, `{"error": "Url is required"}`, http.StatusBadRequest)
		return
	}
	if err := db.Save(&subscription).Error; err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Error updating subscription: %v"}`, err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Subscription updated successfully"})
}

func deleteSubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/app/delete/"):])
	if err != nil {
		http.Error(w, `{"error": "Invalid subscription ID"}`, http.StatusBadRequest)
		return
	}
	if err := db.Delete(&Subscription{}, id).Error; err != nil {
		http.Error(w, fmt.Sprintf(`{"error": "Error deleting subscription: %v"}`, err), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Subscription deleted successfully"})
}

func main() {
	dsn := fmt.Sprintf("%s:%s@tcp(db:3306)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("MYSQL_USER"),
		os.Getenv("MYSQL_PASSWORD"),
		os.Getenv("MYSQL_DATABASE"),
	)
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		fmt.Printf("Failed to connect to database: %v\n", err)
		return
	}

	if err := db.AutoMigrate(&User{}, &Subscription{}); err != nil {
		fmt.Printf("Error in auto migration: %v\n", err)
		return
	}
	fmt.Println("Database migration completed successfully")

	mux := http.NewServeMux()
	mux.HandleFunc("/auth/register", registerHandler)
	mux.HandleFunc("/auth/login", loginHandler)
	mux.HandleFunc("/app/all", getAllSubscriptionsHandler)
	mux.HandleFunc("/app/", getSubscriptionHandler)
	mux.HandleFunc("/app/add", addSubscriptionHandler)
	mux.HandleFunc("/app/update/", updateSubscriptionHandler)
	mux.HandleFunc("/app/delete/", deleteSubscriptionHandler)

	// CORS設定
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // すべてのオリジンを許可
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            true, // デバッグモードを有効化（開発中のみ）
	})

	// CORSミドルウェアを適用
	handler := c.Handler(mux)

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		fmt.Printf("Server failed: %v\n", err)
	}
}
