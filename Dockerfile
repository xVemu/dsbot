FROM oven/bun:1.3.5-alpine

WORKDIR /app

COPY . .
RUN bun install --production

CMD [ "bun", "start" ]
