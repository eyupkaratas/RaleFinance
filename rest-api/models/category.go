package models

import (
	"example.com/rest-api/db"
)

type Category struct {
	ID     int64
	Name   string
	Budget int64
	UserID int64
}

var categories = []Category{}

func (e *Category) Save() error {
	query := `
	INSERT INTO categories(name, budget, user_id) 
	VALUES (?, ?, ?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()
	result, err := stmt.Exec(e.Name, e.Budget, e.UserID)
	if err != nil {
		return err
	}
	id, err := result.LastInsertId()
	e.ID = id
	return err
}

func GetAllCategoriesByUserID(userID int64) ([]Category, error) {
	query := "SELECT id, name, budget, user_id FROM categories WHERE user_id = ?"
	rows, err := db.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category

	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Name, &category.Budget, &category.UserID)
		if err != nil {
			return nil, err
		}

		categories = append(categories, category)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return categories, nil
}

func GetCategoryByID(id int64) (*Category, error) {
	query := "SELECT * FROM categories WHERE id = ?"
	row := db.DB.QueryRow(query, id)

	var category Category
	err := row.Scan(&category.ID, &category.Name, &category.Budget, &category.UserID)
	if err != nil {
		return nil, err
	}

	return &category, nil
}

func (category Category) Update() error {
	query := `
	UPDATE categories
	SET name = ?, budget = ?
	WHERE id = ?
	`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(category.Name, category.Budget, category.ID)
	return err
}

func (category Category) Delete() error {
	query := "DELETE FROM categories WHERE id = ?"
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(category.ID)
	return err
}
