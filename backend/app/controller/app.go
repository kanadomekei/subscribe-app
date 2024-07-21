package controller

import (
	"fmt"
	"net/http"
	"subscrive-app/jwt"
	"subscrive-app/model"
	"time"

	"github.com/gin-gonic/gin"
)

func verifyToken(c *gin.Context) (uint, error) {
	token := c.Request.Header.Get("Authorization")
	fmt.Println(token)

	userId, err := jwt.VerifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token or token expired",
		})
		return 0, err
	}
	return userId, nil
}

func GetAllSubscriptionsHandler(c *gin.Context) {

	userId, err := verifyToken(c)
	if err != nil {
		return
	}
	fmt.Println(userId)
	fmt.Println(err)

	// userId := 1

	var subscriptions []model.Subscription
	if err := db.Where("user_id = ?", userId).Find(&subscriptions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch subscriptions",
		})

		return
	}

	c.JSON(http.StatusOK, subscriptions)
}

func GetSubscriptionHandler(c *gin.Context) {
	userId, err := verifyToken(c)
	if err != nil {
		return
	}

	id := c.Param("id")

	var subscription model.Subscription
	if err := db.First(&subscription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Subscription not found",
		})
		return
	}

	if subscription.UserId != uint(userId) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized to view this subscription",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"AppName":   subscription.AppName,
		"ID":        subscription.ID,
		"Price":     subscription.Price,
		"StartDate": subscription.StartDate,
		"Interval":  subscription.Interval,
		"Payment":   subscription.Payment,
		"Period":    subscription.Period,
		"Url":       subscription.Url,
		"UserId":    subscription.UserId,
	})
}

func AddSubscriptionHandler(c *gin.Context) {
	userId, err := verifyToken(c)
	if err != nil {
		return
	}

	var subscription model.Subscription
	if error := c.Bind(&subscription); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}
	subscription.UserId = uint(userId)

	if subscription.StartDate.IsZero() {
		subscription.StartDate = time.Now()
	}
	if err := db.Create(&subscription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create subscription",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Subscription created successfully",
	})
}

func UpdateSubscriptionHandler(c *gin.Context) {
	userId, err := verifyToken(c)
	if err != nil {
		return
	}

	id := c.Param("id")
	var newSubscription model.Subscription
	if error := c.Bind(&newSubscription); error != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request payload",
		})
		return
	}

	var subscription model.Subscription

	if err := db.First(&subscription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Subscription not found",
		})
		return
	}

	if subscription.UserId != uint(userId) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized to update this subscription",
		})
		return
	}

	newSubscription.UserId = subscription.UserId

	// subscriptionのレコードをnewSubscriptionの内容で更新
	if err := db.Model(&subscription).Updates(newSubscription).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update subscription",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Subscription updated successfully",
	})
}

func DeleteSubscriptionHandler(c *gin.Context) {
	userId, err := verifyToken(c)
	if err != nil {
		return
	}

	id := c.Param("id")
	var subscription model.Subscription
	if err := db.First(&subscription, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Subscription not found",
		})
		return
	}

	if subscription.UserId != uint(userId) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "You are not authorized to delete this subscription",
		})
		return
	}

	if err := db.Delete(&model.Subscription{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete subscription",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Subscription deleted successfully",
	})
}
