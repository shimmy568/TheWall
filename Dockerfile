FROM golang

ARG dev_build="true"

# Install node
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get update && apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install -y yarn

# Install go deps
RUN go get github.com/lib/pq
RUN go get github.com/dpapathanasiou/go-recaptcha
RUN go get github.com/gin-gonic/gin
RUN go get github.com/mattn/go-sqlite3

COPY frontend/yarn.lock /app/frontend/yarn.lock
COPY frontend/package.json /app/frontend/package.json
# Run yarn to get node deps
WORKDIR /app/frontend
RUN yarn

# install sqlite and setup datebase (if development build)
COPY server/sqlShite/createSchema.sql /app/server/sqlShite/createSchema.sql
RUN if [ ${dev_build} = "true" ]; then apt-get update && apt-get install sqlite3 && sqlite3 /app/development.db < /app/server/sqlShite/createSchema.sql; fi

COPY frontend/src /app/frontend/src
COPY frontend/webpack.config.js /app/frontend/webpack.config.js
RUN npm run build

COPY server /app/server

# Do all the lightweight expose and env stuff at the end
EXPOSE 8080
ENV dev=${dev_build}

# Run go server
WORKDIR /app/
CMD go run server/*.go