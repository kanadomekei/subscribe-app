package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

func registerHandler(c *gin.Context) {
	fmt.Println(c.PostForm("UserName"))
	fmt.Println(c.PostForm("EncryptedPassword"))
	var user User
	if error := c.Bind(&user); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	if user.UserName == "" || user.EncryptedPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "User name and password are required",
		})
		return
	}

	hashPassword, err := hashPassword(user.EncryptedPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
		})
		return
	}
	user.EncryptedPassword = hashPassword

	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"access_token":  jwt.GenerateToken(user.ID, 1),
		"refresh_token": jwt.GenerateToken(user.ID, 72),
		"message":       "User created successfully",
		"user":          user.UserName,
		"userID":        user.ID,
		"success":       true,
	})
}

func loginHandler(c *gin.Context) {
	var user User
	if error := c.Bind(&user); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	fmt.Println(user.UserName)
	fmt.Println(user.EncryptedPassword)

	var foundUser User
	if err := db.Where("user_name = ?", user.UserName).First(&foundUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user name or password",
		})
		return
	}

	if !checkPasswordHash(user.EncryptedPassword, foundUser.EncryptedPassword) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user name or password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token":  jwt.GenerateToken(user.ID, 1),
		"refresh_token": jwt.GenerateToken(user.ID, 72),
		"message":       "Login successful",
		"user":          user.UserName,
		"userID":        user.ID,
		"success":       true,
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

	// routing
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"*"},
		AllowHeaders: []string{"*"},
	}))
	router.GET("/hc", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "service working",
		})
	})

	// /auth/ のルーティング
	auth := router.Group("/auth")
	{
		auth.POST("/register", registerHandler)
		auth.POST("/login", loginHandler)
	}

	// /app/ のルーティング
	app := router.Group("/app")
	{
		app.GET("/all")
		app.GET("/:id")
		app.POST("/add")
		app.PUT("/update/:id")
		app.DELETE("/delete/:id")
	}

	router.Run(":8080")
}
