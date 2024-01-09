FROM node:current-alpine

RUN mkdir -p /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Command for container to execute
CMD [ "npm", "start" ]
