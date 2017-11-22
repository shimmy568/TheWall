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
	password = "password123"
	dbname   = "TheWall"
	coolDown = 3 //Three second cooldown on posting
)

type messagePostBody struct {
	Message string `json:"message" binding:"required"`
}

type messageGetBody struct {
	Message string `json:"message" binding:"required"`
	ID      int    `json:"id" binding:"required"`
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

//makeNewPost adds a new post to the database
func makeNewPost(db *sql.DB, message string, ip string) {
	sqlStatement := `
	INSERT INTO messages (message, ip, time)
	VALUES ($1, $2, $3)`

	curTime := time.Now().Unix()

	_, err := db.Exec(sqlStatement, message, ip, curTime)

	if err != nil {
		panic(err)
	}
}

//canPost checks if a given user is able to post agian using their IP given a cooldown, also checks the banlist to see if the given
//IP has been banned.
func canPost(db *sql.DB, ip string) (string, bool) {
	cool := make(chan bool, 1)
	notBanned := make(chan bool)

	//To check if the user is banned or not
	go func() {
		sqlStatement1 := `
		SELECT expire
		FROM banList
		WHERE ip = $1;`

		sqlStatement2 := `
		DELETE FROM banList
		WHERE ip = $1;`

		var expireTime int64

		err := db.QueryRow(sqlStatement1, ip).Scan(&expireTime)

		if err != nil {
			if err == sql.ErrNoRows {
				notBanned <- true
				return
			}
			panic(err)

		}

		if time.Now().Unix() >= expireTime {
			db.Exec(sqlStatement2, ip)
			notBanned <- true
			return
		}
		notBanned <- false
	}()

	//To check if the user is cool or not (the time between their last post and this one is larger than the cooldown)
	go func() {
		currentTime := time.Now().Unix()
		sqlStatement := `
		SELECT message
		FROM messages
		WHERE ip = $1 AND time > $2`

		var temp string

		err := db.QueryRow(sqlStatement, ip, currentTime-coolDown).Scan(&temp)

		if err != nil {
			if err == sql.ErrNoRows {
				cool <- true
				return
			}
			panic(err)
		}

		cool <- false
	}()

	coolResult := <-cool
	notBannedResult := <-notBanned

	if !coolResult && !notBannedResult {
		return "both", false
	} else if !coolResult && notBannedResult {
		return "cooldown", false
	} else if coolResult && !notBannedResult {
		return "banned", false
	}

	return "", true

}

func getMessages(db *sql.DB) []*messageGetBody {
	sqlStatement := `
	SELECT message, id
	FROM messages
	ORDER BY id DESC
	LIMIT 100`

	rows, err := db.Query(sqlStatement)
	if err != nil {
		panic(err)
	}

	defer rows.Close()

	data := make([]*messageGetBody, 0)

	for rows.Next() {
		var msg string
		var id int
		rows.Scan(&msg, &id)
		data = append(data, &messageGetBody{Message: msg, ID: id})
	}

	return data
}

//Bans an IP from posting, the during is in seconds so your gonna have to math a bit
func banIP(db *sql.DB, ip string, duration int64) {
	sqlStatement := `
	INSERT INTO banList (ip, expire)
	VALUES ($1, $2)`

	expire := time.Now().Unix() + duration
	_, err := db.Exec(sqlStatement, ip, expire)

	if err != nil {
		panic(err)
	}
}

//Unbans an IP
func unBanIP(db *sql.DB, ip string) {
	sqlStatement := `
	DELETE FROM banList
	WHERE ip = $1`

	_, err := db.Exec(sqlStatement, ip)

	if err != nil {
		panic(err)
	}
}

func main() {
	db := connectToDb()
	defer db.Close()

	r := gin.Default()

	r.StaticFS("/", http.Dir("./../frontend/dist/"))

	r.POST("/newMessage", func(c *gin.Context) {
		var binder messagePostBody
		err := c.ShouldBindJSON(&binder)
		if err == nil {
			reason, result := canPost(db, c.ClientIP())
			if result {
				go makeNewPost(db, binder.Message, c.ClientIP())
			} else {
				if reason == "both" {
					reason = "banned"
				}
				c.JSON(http.StatusUnauthorized, gin.H{"error": reason})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	r.POST("/getMessages", func(c *gin.Context) {
		msgs := getMessages(db)
		fmt.Println(msgs)
		c.JSON(200, msgs)
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
