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

EXPOSE 3001

CMD ["sh", "-c", "while ! nc -z db 5432; do sleep 1; done && npx prisma migrate deploy && npm run start:dev"]