package main

import (
	"database/sql"
	"fmt"
	"time"

	recaptcha "github.com/dpapathanasiou/go-recaptcha"
)

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

func checkRecaptcha(recaptchaInfo string, ip string, output chan bool) {
	output <- recaptcha.Confirm(ip, recaptchaInfo)
}

func isBanned(db *sql.DB, ip string, output chan bool) {
	sqlStatement1 := `
	SELECT expire
	FROM banList
	WHERE ip = $1;`

	sqlStatement2 := `
	DELETE FROM banList
	WHERE ip = $1;`

	var expireTime int64

	//Check if the user has an entry in the banlist
	err := db.QueryRow(sqlStatement1, ip).Scan(&expireTime)
	if err != nil {
		//If they don't they are not banned
		if err == sql.ErrNoRows {
			output <- false
			return
		}
		panic(err)

	}

	//Check if the users ban has expired
	if time.Now().Unix() >= expireTime {
		db.Exec(sqlStatement2, ip)
		output <- false
		return
	}

	output <- true
}

//addSession adds a session for a given ip that allows them to post without doing the recaptcha for a given piriod of time
//but first it removes any sessions that the user currently might have in the db
func addSession(db *sql.DB, ip string) {
	sqlStatement1 := `
	DELETE FROM sessionData
	WHERE ip = $1`
	sqlStatement2 := `
	INSERT INTO sessionData
	(ip, expire)
	VALUES ($1, $2);`

	_, err := db.Exec(sqlStatement1, ip)
	if err != nil {
		panic(err)
	}

	expire := time.Now().Unix() + sessionExpire
	_, err = db.Exec(sqlStatement2, ip, expire)
	if err != nil {
		panic(err)
	}

}

//hasSession is a function that should be called in a goroutine and resp should be buffered 1 for best results
func hasSession(db *sql.DB, ip string, resp chan bool) {
	fmt.Println("ayyyyy")
	sqlStatement1 := `
	SELECT expire
	FROM sessionData
	WHERE ip = $1;`

	sqlStatement2 := `
	DELETE FROM sessionData
	WHERE ip = $1;`

	var expire int64
	err := db.QueryRow(sqlStatement1, ip).Scan(&expire)
	if err != nil {
		if err == sql.ErrNoRows {
			resp <- false
			return
		}
		panic(err)
	}

	if expire < time.Now().Unix() {
		resp <- false
		_, err = db.Exec(sqlStatement2, ip)
		if err != nil {
			panic(err)
		}
		return
	}

	resp <- true
}

func cleanSessions(db *sql.DB) {
	sqlStatement := `
	DELETE FROM sessionData
	WHERE expire < $1`

	_, err := db.Exec(sqlStatement)
	if err != nil {
		panic(err)
	}
}

func isCoolDownActive(db *sql.DB, ip string, output chan bool) {
	currentTime := time.Now().Unix()
	sqlStatement := `
	SELECT message
	FROM messages
	WHERE ip = $1 AND time > $2`

	var temp string

	err := db.QueryRow(sqlStatement, ip, currentTime-coolDown).Scan(&temp)

	if err != nil {
		if err == sql.ErrNoRows {
			output <- false
			return
		}
		panic(err)
	}

	output <- true
}
