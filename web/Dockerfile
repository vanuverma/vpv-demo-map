# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# VITE_ env variables are injected at build time — passed as build args from docker-compose
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_GOOGLE_MAPS_MAP_ID
ARG VITE_AUTH0_DOMAIN
ARG VITE_AUTH0_CLIENT_ID
ARG VITE_AUTH0_AUDIENCE
ARG VITE_SHOW_GOOGLE_MAP=true

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
ENV VITE_GOOGLE_MAPS_MAP_ID=$VITE_GOOGLE_MAPS_MAP_ID
ENV VITE_AUTH0_DOMAIN=$VITE_AUTH0_DOMAIN
ENV VITE_AUTH0_CLIENT_ID=$VITE_AUTH0_CLIENT_ID
ENV VITE_AUTH0_AUDIENCE=$VITE_AUTH0_AUDIENCE
ENV VITE_SHOW_GOOGLE_MAP=$VITE_SHOW_GOOGLE_MAP

RUN npm run build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# 'serve' is a lightweight static file server — no nginx needed
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
