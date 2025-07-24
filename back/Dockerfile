# back/Dockerfile
FROM node:20-alpine

# Installer OpenSSL et les outils nécessaires
RUN apk add --no-cache netcat-openbsd openssl openssl-dev

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Nettoyer le cache npm et installer avec --legacy-peer-deps
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copier le schema Prisma
COPY prisma/ ./prisma/

# Générer le client Prisma avec la bonne version d'OpenSSL
ENV OPENSSL_CONF=/etc/ssl/
RUN npx prisma generate

# Copier tout le code source
COPY src/ ./src/

# Build de l'application avec vérification
# RUN npm run build && \
#     echo "Build verification:" && \
#     ls -la dist/ && \
#     test -f dist/main.js && \
#     echo "✅ Build successful!"

EXPOSE 3001

# Variables d'environnement pour OpenSSL
ENV OPENSSL_CONF=/etc/ssl/

# Script de démarrage amélioré
CMD ["sh", "-c", "\
    echo '🚀 Starting MatchFlow Backend...' && \
    echo '⏳ Waiting for database...' && \
    while ! nc -z db 5432; do sleep 1; done && \
    echo '✅ Database ready!' && \
    echo '🔧 Regenerating Prisma client...' && \
    OPENSSL_CONF=/etc/ssl/ npx prisma generate && \
    echo '📊 Running migrations...' && \
    OPENSSL_CONF=/etc/ssl/ npx prisma migrate deploy && \
    echo '🎯 Starting application...' && \
    exec npm run start:dev \
"]