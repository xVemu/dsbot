FROM oven/bun:1.2.19-alpine

WORKDIR /app

COPY . .
RUN bun install --production

CMD [ "bun", "start" ]
