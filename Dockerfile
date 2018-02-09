FROM golang

EXPOSE 8080

# Install node
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get install -y yarn

# Install go deps
RUN go get github.com/lib/pq
RUN go get github.com/dpapathanasiou/go-recaptcha
RUN go get github.com/gin-gonic/gin

# Run yarn to get node deps
WORKDIR /frontend
RUN yarn && npm build

# Run go server
WORKDIR /
WORKDIR go run /server/*.go