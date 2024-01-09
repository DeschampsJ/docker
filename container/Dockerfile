FROM node:current-alpine

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

# Install dependencies
RUN npm install

# Command for container to execute
ENTRYPOINT [ "node", "app.js" ]