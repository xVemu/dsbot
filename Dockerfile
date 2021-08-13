FROM node:16.6.1
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD [ "node", "src/index.js" ]