# TheWall
A simple message board web app built in React and GoLang. The project uses Docker to start up and shut down the server

# Screenshots

# Get running.

To get the application running just run this command:

> sudo docker build -t thewall . && sudo docker run -p 8080:8080 thewall

## Small note

Beucase of how Docker is you can't just Ctrl+C to kill them to stop the container run this command from another terminal.

> sudo docker rm $(sudo docker stop $(sudo docker ps -a -q --filter ancestor=thewall --format="{{.ID}}"))

Either that or run the container with the `-d` flag and just stop it normally like any other docker container.
