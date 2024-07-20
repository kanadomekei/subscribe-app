package model

import "time"

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
