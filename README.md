# TheWall
Just a little project that is meant to let people post anonymously to a wall or message board of sorts (no replying though [maybe for later])

That's it. No, really that's it. I just wanted to get an idea of how to deploy an app to an AWS instance and what not.

# Get running.

Update this bad boy with Docker. Make sure you have docker installed and then run this one command to spin up
the container to get this bad boy running on localhost:8080. (make sure your in the root dir of the repo)

> sudo docker build -t thewall . && sudo docker run -p 8080:8080 thewall

Boom, fucking magic. Love me some Docker.

## Small note

Beucase of how Docker is you can't just Ctrl+C to kill them to stop the container run this command from another terminal.

> sudo docker rm $(sudo docker stop $(sudo docker ps -a -q --filter ancestor=thewall --format="{{.ID}}"))
