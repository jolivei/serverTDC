FROM node:14.21.0-alpine

WORKDIR /app
RUN apk add --update postgresql-client
COPY . .
ENTRYPOINT ["npm" ,"run", "dev"]