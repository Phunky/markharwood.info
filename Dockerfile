# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Inlined into the client bundle for browser Last.fm requests. Pass via build-args or CI secrets.
ARG PUBLIC_LASTFM_API_KEY
ARG PUBLIC_LASTFM_USER
ENV PUBLIC_LASTFM_API_KEY=$PUBLIC_LASTFM_API_KEY
ENV PUBLIC_LASTFM_USER=$PUBLIC_LASTFM_USER

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
