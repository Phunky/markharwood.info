# syntax=docker/dockerfile:1

FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Used at `npm run build` (static site prerender). Pass via `docker build --build-arg` or CI secrets.
ARG LASTFM_API_KEY
ARG LASTFM_USER
ENV LASTFM_API_KEY=$LASTFM_API_KEY
ENV LASTFM_USER=$LASTFM_USER

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
