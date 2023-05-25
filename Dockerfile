FROM node:lts-alpine

WORKDIR /app

RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY . .
RUN pnpm install -r --offline --prod

CMD [ "pnpm", "run", "start" ]
