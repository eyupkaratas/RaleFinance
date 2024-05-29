package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "api.db")

	if err != nil {
		panic("Could not connect to database.")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTables()
}

func createTables() {
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		name TEXT,
		surname TEXT,
		goal_text TEXT,
		goal_value INTEGER
	)
	`

	_, err := DB.Exec(createUsersTable)

	if err != nil {
		panic("Could not create users table.")
	}

	createCategoriesTable := `
	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL UNIQUE,
		budget INTEGER NOT NULL,
		user_id INTEGER,
		FOREIGN KEY(user_id) REFERENCES users(id)
	)
	`

	_, err = DB.Exec(createCategoriesTable)

	if err != nil {
		panic("Could not create categories table.")
	}

	createTransactionsTable := `
	CREATE TABLE IF NOT EXISTS transactions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		dateTime DATETIME NOT NULL,
		amount INTEGER NOT NULL,
		is_income INTEGER NOT NULL,
		user_id INTEGER,
		category_id INTEGER,
		FOREIGN KEY(user_id) REFERENCES users(id),
		FOREIGN KEY(category_id) REFERENCES categories(id)
	)
	`

	_, err = DB.Exec(createTransactionsTable)

	if err != nil {
		panic("Could not create transactions table.")
	}
}
