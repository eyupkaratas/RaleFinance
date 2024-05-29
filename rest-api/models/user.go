package models

import (
	"errors"

	"example.com/rest-api/db"
	"example.com/rest-api/utils"
)

type User struct {
	ID        int64
	Email     string
	Password  string
	Name      string
	Surname   string
	GoalText  string
	GoalValue int64
}

func (u User) Save() error {
	query := "INSERT INTO users(email, password, name, surname, goal_text, goal_value) VALUES (?, ?, ?, ?, ?, ?)"
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)

	if err != nil {
		return err
	}

	result, err := stmt.Exec(u.Email, hashedPassword, u.Name, u.Surname, u.GoalText, u.GoalValue)

	if err != nil {
		return err
	}

	userId, err := result.LastInsertId()

	u.ID = userId
	return err
}

func (u *User) ValidateCredentials() error {
	query := "SELECT id, password FROM users WHERE email = ?"
	row := db.DB.QueryRow(query, u.Email)

	var retrievedPassword string
	err := row.Scan(&u.ID, &retrievedPassword)

	if err != nil {
		return errors.New("Credentials invalid")
	}

	passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)

	if !passwordIsValid {
		return errors.New("Credentials invalid")
	}

	return nil
}

func GetUserByID(id int64) (*User, error) {
	query := "SELECT id, name, surname, goal_text, goal_value FROM users WHERE id = ?"
	row := db.DB.QueryRow(query, id)

	var user User
	err := row.Scan(&user.ID, &user.Name, &user.Surname, &user.GoalText, &user.GoalValue)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (user User) Update() error {
	query := `
	UPDATE users
	SET goal_text = ?, goal_value = ?
	WHERE id = ?
	`
	stmt, err := db.DB.Prepare(query)

	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(user.GoalText, user.GoalValue, user.ID)
	return err
}
