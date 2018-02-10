FROM golang

ARG dev_build="true"
ENV dev=${dev_build}
ADD . /app

# Install node
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update
RUN apt-get install -y yarn

# Install go deps
RUN go get github.com/lib/pq
RUN go get github.com/dpapathanasiou/go-recaptcha
RUN go get github.com/gin-gonic/gin
RUN go get github.com/mattn/go-sqlite3

# install sqlite and setup datebase (if development build)
RUN if [ $dev = "true" ]; then apt-get install sqlite3 && sqlite3 /app/development.db < /app/server/sqlShite/createSchema.sql; fi

# Run yarn to get node deps
WORKDIR /app/frontend
RUN yarn && npm build

EXPOSE 8080

# Run go server
WORKDIR /app/
CMD go run server/*.go