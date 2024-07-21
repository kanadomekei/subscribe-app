package controller

import (
	"fmt"
	"net/http"
	"subscrive-app/jwt"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"subscrive-app/model"
)

// initialize
var db *gorm.DB

func SetDB(database *gorm.DB) {
	db = database
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func RegisterHandler(c *gin.Context) {
	fmt.Println(c.PostForm("UserName"))
	fmt.Println(c.PostForm("EncryptedPassword"))
	var user model.User
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
		"accessToken":  jwt.GenerateToken(user.ID, 1),
		"refreshToken": jwt.GenerateToken(user.ID, 72),
		"message":      "User created successfully",
		"user":         user.UserName,
		"userID":       user.ID,
		"success":      true,
	})
}

func LoginHandler(c *gin.Context) {
	var user model.User
	if error := c.Bind(&user); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	var foundUser model.User
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
		"accessToken":  jwt.GenerateToken(foundUser.ID, 1),
		"refreshToken": jwt.GenerateToken(foundUser.ID, 72),
		"message":      "Login successful",
		"user":         user.UserName,
		"userID":       foundUser.ID,
		"success":      true,
	})
}

func RefreshTokenHandler(c *gin.Context) {
	refresh_token := c.Request.Header.Get("Authorization")
	if refresh_token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Refresh token is required",
		})
		return
	}

	user_id, err := jwt.VerifyToken(refresh_token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid refresh token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accessToken":  jwt.GenerateToken(user_id, 1),
		"refreshToken": jwt.GenerateToken(user_id, 72),
		"message":      "Token refreshed successfully",
		"success":      true,
	})
}
