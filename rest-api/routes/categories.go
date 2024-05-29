package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"example.com/rest-api/models"
	"github.com/gin-gonic/gin"
)

func getCategories(context *gin.Context) {
	userID := context.GetInt64("userId")
	if userID == 0 {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "User ID not found"})
		return
	}

	categories, err := models.GetAllCategoriesByUserID(userID)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch categories. Try again later."})
		return
	}
	context.JSON(http.StatusOK, categories)
}

func createCategory(context *gin.Context) {
	var category models.Category
	err := context.ShouldBindJSON(&category)
	fmt.Println(err)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
		return
	}

	userId := context.GetInt64("userId")
	category.UserID = userId

	err = category.Save()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create category. Try again later."})
		return
	}

	context.JSON(http.StatusCreated, gin.H{"message": "Category created!", "category": category})
}

func updateCategory(context *gin.Context) {
	categoryId, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse category id."})
		return
	}

	userId := context.GetInt64("userId")
	category, err := models.GetCategoryByID(categoryId)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch the category."})
		return
	}

	if category.UserID != userId {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized to update category."})
		return
	}

	var updatedCategory models.Category
	err = context.ShouldBindJSON(&updatedCategory)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data."})
		return
	}

	updatedCategory.ID = categoryId
	err = updatedCategory.Update()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not update category."})
		return
	}
	context.JSON(http.StatusOK, gin.H{"message": "Category updated successfully!"})
}

func deleteCategory(context *gin.Context) {
	categoryId, err := strconv.ParseInt(context.Param("id"), 10, 64)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse category id."})
		return
	}

	userId := context.GetInt64("userId")
	category, err := models.GetCategoryByID(categoryId)

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not fetch the category."})
		return
	}

	if category.UserID != userId {
		context.JSON(http.StatusUnauthorized, gin.H{"message": "Not authorized to delete category."})
		return
	}

	err = category.Delete()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Could not delete the category."})
		return
	}

	context.JSON(http.StatusOK, gin.H{"message": "Category deleted successfully!"})
}
