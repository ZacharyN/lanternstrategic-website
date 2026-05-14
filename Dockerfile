# Stage 1 — build the static site
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public

# PUBLIC_WEB3FORMS_ACCESS_KEY must be set at build time to be inlined
# into the static JS. Pass via `docker build --build-arg`.
ARG PUBLIC_WEB3FORMS_ACCESS_KEY
ENV PUBLIC_WEB3FORMS_ACCESS_KEY=$PUBLIC_WEB3FORMS_ACCESS_KEY

RUN npm run build

# Stage 2 — serve with Caddy
FROM caddy:alpine
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
