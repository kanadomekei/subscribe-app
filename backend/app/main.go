package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"subscrive-app/controller"
	"subscrive-app/model"
	_ "subscrive-app/model"
)

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

	if err := db.AutoMigrate(&model.User{}, &Subscription{}); err != nil {
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

	// controllerパッケージにデータベース接続を設定
	controller.SetDB(db)

	// /auth/ のルーティング
	auth := router.Group("/auth")
	{
		auth.POST("/register", controller.RegisterHandler)
		auth.POST("/login", controller.LoginHandler)
		auth.POST("/refresh", controller.RefreshTokenHandler)
	}

	// /app/ のルーティング
	app := router.Group("/app")
	{
		app.GET("/all", controller.GetAllSubscriptionsHandler)
		app.GET("/:id", controller.GetSubscriptionHandler)
		app.POST("/add", controller.AddSubscriptionHandler)
		app.PUT("/update/:id", controller.UpdateSubscriptionHandler)
		app.DELETE("/delete/:id", controller.DeleteSubscriptionHandler)
	}

	router.Run(":8080")
}
