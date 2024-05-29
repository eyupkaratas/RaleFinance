package routes

import (
	"example.com/rest-api/middlewares"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(server *gin.Engine) {

	authenticated := server.Group("/")
	authenticated.Use(middlewares.Authenticate)
	authenticated.GET("/categories", getCategories)
	authenticated.POST("/categories", createCategory)
	authenticated.PUT("/categories/:id", updateCategory)
	authenticated.DELETE("/categories/:id", deleteCategory)

	authenticated.PUT("/users/:id", updateUser)

	authenticated.GET("/transactions", getTransactions)
	authenticated.POST("/transactions", createTransaction)

	server.GET("/users/:id", getUser)
	server.POST("/signup", signup)
	server.POST("/login", login)
}
