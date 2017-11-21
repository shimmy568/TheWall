package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "Password123"
	dbname   = "TheWall"
)

type messageBody struct {
	Message string `json:"message" binding:"required"`
}

func connectToDb() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	//Create the connection to the database
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

	//Check if we can ping the database
	err = db.Ping()
	if err != nil {
		panic(err)
	}

	return db
}

func insertIntoUsers(db *sql.DB) {
	sqlStatement := `
	INSERT INTO users (age, email, first_name, last_name)
	VALUES ($1, $2, $3, $4)
	RETURNING id`

	id := 0
	err := db.QueryRow(sqlStatement, 18, "owenthomasanderson@gmail.com", "Owen", "Anderson").Scan(&id)
	if err != nil {
		panic(err)
	}
	fmt.Println("The id of the new record is:", id)
}

func makeNewPost(db *sql.DB, message string, ip string) {
	sqlStatement := `
	INSERT INTO posts (message, ip, time)
	VALUES ($1, $2, $3)`

	curTime := time.Now().Unix()

	_, err := db.Exec(sqlStatement, message, ip, curTime)

	if err != nil {
		panic(err)
	}
}

func main() {
	db := connectToDb()
	defer db.Close()

	r := gin.Default()
	r.POST("/newMessage", func(c *gin.Context) {
		var binder messageBody
		err := c.ShouldBindJSON(&binder)
		if err == nil {
			fmt.Println(binder.Message)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
