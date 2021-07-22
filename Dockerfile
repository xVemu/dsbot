# syntax=docker/dockerfile:1
FROM node:lts
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "src/index.js" ]