FROM node:20-bookworm-slim AS frontend

WORKDIR /src
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates mariadb-server \
  && rm -rf /var/lib/apt/lists/* /var/lib/mysql

COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
RUN DATABASE_URL="mysql://build:build@127.0.0.1:3306/build" npm ci

COPY backend/ ./
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY --from=frontend /src/dist ./public
RUN DATABASE_URL="mysql://build:build@127.0.0.1:3306/build" npx prisma generate \
  && npm run build

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["sh", "/entrypoint.sh"]
