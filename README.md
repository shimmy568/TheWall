# TheWall
Just a little project that is meant to let people post anonymously to a wall or message board of sorts (no replying though [maybe for later])

That's it. No, really that's it. I just wanted to get an idea of how to deploy an app to an AWS instance and what not.

# Backend

## Install dependencies
> go get server/...

not 100% sure about this solution, may have to do the good ole run crash install method :grimacing:

## Run server
NOTE: This must be run from the root folder in the project. If it is run from anywhere else the go server
will not be able to located the static files to serve.
> go run server/*.go

## Setup postgres DB

Make new user and configure to match login info in server.go

Make new database title TheWall

Run createSchema.sql to create tables in database

# Front end

## Install dependencies
Go to front end folder
> cd frontend

Just run
> yarn

You gonna need yarn for this so get that first [here](https://yarnpkg.com/en/)

## Build bundle

One time build
> npm run build

Watch mode
> npm run watch
