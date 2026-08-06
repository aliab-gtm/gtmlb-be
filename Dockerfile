# GTM CMS (Strapi 5) — production image.
# Postgres-backed; uploads persist in the /app/public/uploads volume
# (see gtmlb-fe/deploy/docker-compose.prod.yml).

FROM node:22-alpine AS build
WORKDIR /app
# better-sqlite3 (a dependency even when unused) compiles native code.
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=1337
COPY --from=build /app ./
RUN chown -R node:node /app
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
