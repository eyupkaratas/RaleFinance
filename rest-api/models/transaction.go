package models

import (
	"time"

	"example.com/rest-api/db"
)

type Transaction struct {
	ID         int64
	DateTime   time.Time
	Amount     int64
	IsIncome   int64
	UserID     int64
	CategoryID int64
}

var transactions = []Transaction{}

func (e *Transaction) Save() error {
	query := `
	INSERT INTO transactions(dateTime, amount, is_income, user_id, category_id) 
	VALUES (?, ?, ?, ?, ?)`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	result, err := stmt.Exec(e.DateTime, e.Amount, e.IsIncome, e.UserID, e.CategoryID)
	if err != nil {
		return err
	}
	id, err := result.LastInsertId()
	e.ID = id
	return err
}

func GetAllTransactionsByUserID(userID int64) ([]Transaction, error) {
	query := "SELECT id, dateTime, amount, is_income, user_id, category_id FROM transactions WHERE user_id = ?"
	rows, err := db.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []Transaction

	for rows.Next() {
		var transaction Transaction
		err := rows.Scan(&transaction.ID, &transaction.DateTime, &transaction.Amount, &transaction.IsIncome, &transaction.UserID, &transaction.CategoryID)
		if err != nil {
			return nil, err
		}

		transactions = append(transactions, transaction)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return transactions, nil
}
