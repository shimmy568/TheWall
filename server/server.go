package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"

	recaptcha "github.com/dpapathanasiou/go-recaptcha"
	"github.com/gin-gonic/gin"
)

const (
	host          = "localhost"
	port          = 5432
	user          = "postgres"
	password      = "password123"
	dbname        = "TheWall"
	coolDown      = 3 //Three second cooldown on posting
	sessionExpire = 24 * 60 * 60
)

type messageGetBody struct {
	Message string `json:"message" binding:"required"`
	ID      int    `json:"id" binding:"required"`
}

type messagePostBody struct {
	Message       string `json:"message" binding:"required"`
	RecaptchaInfo string `json:"recaptchaInfo" binding:"required"`
}

type recaptchaInfoRequestBody struct {
	Secret   string `json:"secret"`
	Response string `json:"response"`
	Remoteip string `json:"remoteip"`
}

type recaptchaInfoResponseBody struct {
	Success     bool      `json:"success" binding:"required"`
	ChallengeTs string    `json:"challenge_ts" binding:"required"`
	Hostname    string    `json:"hostname" binding:"required"`
	ErrorCodes  []*string `json:"error-codes"`
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

//canPost checks if a given user is able to post agian using their IP given a cooldown, also checks the banlist to see if the given
//IP has been banned.
func canPost(db *sql.DB, ip string, recaptchaString string) bool {
	coolDownActive := make(chan bool, 1)
	banned := make(chan bool)
	recaptchaValid := make(chan bool)

	//To check if the user is banned or not
	go isBanned(db, ip, banned)

	//To check if the user is cool or not (the time between their last post and this one is larger than the cooldown)
	go isCoolDownActive(db, ip, coolDownActive)

	//To check is the recaptcha that has been provided is valid
	go checkRecaptcha(recaptchaString, ip, recaptchaValid)

	coolDownActiveResult := <-coolDownActive
	bannedResult := <-banned
	recaptchaValidResponse := <-recaptchaValid

	if coolDownActiveResult || bannedResult || !recaptchaValidResponse {
		return false
	}

	return true

}

func main() {
	recaptcha.Init("6LckYSAUAAAAAF7j3zlo1HJRPe5YqA9d21ZqCllH")

	db := connectToDb()
	defer db.Close()

	r := gin.Default()

	r.StaticFS("/", http.Dir("./../frontend/dist/"))

	r.POST("/newMessage", func(c *gin.Context) {
		var binder messagePostBody
		err := c.ShouldBindJSON(&binder)
		if err == nil {
			result := canPost(db, c.ClientIP(), binder.RecaptchaInfo)
			if result {
				go makeNewPost(db, binder.Message, c.ClientIP())
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Not allowed to post"})
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		}
	})

	r.POST("/getMessages", func(c *gin.Context) {
		msgs := getMessages(db)
		c.JSON(200, msgs)
	})
	r.Run() // listen and serve on 0.0.0.0:8080
}
