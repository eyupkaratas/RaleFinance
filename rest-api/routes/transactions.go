package routes

import (
	"fmt"
	"net/http"

	"example.com/rest-api/models"
	"github.com/gin-gonic/gin"
)

func getTransactions(context *gin.Context) {
	userID := context.GetInt64("userId")
	if userID == 0 {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "User ID not found"})
		return
	}

	transactions, err := models.GetAllTransactionsByUserID(userID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch transactions. Try again later."})
		return
	}
	context.JSON(http.StatusOK, transactions)
}

func createTransaction(context *gin.Context) {
	var transaction models.Transaction
	err := context.ShouldBindJSON(&transaction)
	fmt.Println(err)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
		return
	}

	userId := context.GetInt64("userId")
	transaction.UserID = userId

	err = transaction.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create transaction. Try again later."})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "Transaction created!", "transaction": transaction})
}
