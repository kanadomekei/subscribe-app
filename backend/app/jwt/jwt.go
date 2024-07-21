package jwt

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ユーザIDと有効期限からトークンを生成する
// expは何時間の単位で指定
func GenerateToken(id uint, exp uint) string {
	token_type := ""
	if exp == 1 {
		token_type = "access"
	} else {
		token_type = "refresh"
	}

	claims := jwt.MapClaims{
		"user_id":    id,
		"token_type": token_type,
		"exp":        time.Now().Add(time.Hour * time.Duration(exp)).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessToken, _ := token.SignedString([]byte(os.Getenv("JWT_ACCESS_SECRET")))
	return accessToken
}

func VerifyToken(tokenString string) (uint, error) {
	// トークンの解析
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_ACCESS_SECRET")), nil
	})

	if err != nil {
		fmt.Println("Token parse error:", err)
		return 0, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// ユーザIDの取得
		userId, ok := claims["user_id"].(float64)
		if !ok {
			return 0, fmt.Errorf("invalid user_id type")
		}

		// 有効期限の取得
		exp, ok := claims["exp"].(float64)
		if !ok {
			return 0, fmt.Errorf("invalid exp type")
		} else if int64(exp) < time.Now().Unix() {
			return 0, fmt.Errorf("token is expired")
		}

		// access tokenかどうかの確認
		tokenType, ok := claims["token_type"].(string)
		if !ok || tokenType != "access" {
			return 0, fmt.Errorf("token is invalid")
		}

		return uint(userId), nil
	}
	return 0, fmt.Errorf("token is invalid")
}
