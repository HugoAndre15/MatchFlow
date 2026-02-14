FROM node:20-alpine

RUN apk add --no-cache netcat-openbsd openssl openssl-dev

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm cache clean --force && npm install --legacy-peer-deps

COPY prisma/ ./prisma/

RUN npx prisma generate

COPY src/ ./src/

# Build NestJS application
RUN npm run build && ls -la dist/

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["docker-entrypoint.sh"]