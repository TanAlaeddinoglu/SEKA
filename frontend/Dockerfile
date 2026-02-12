# syntax=docker/dockerfile:1.7

############################
# deps (cache'li)
############################
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./

# npm cache kullan (build sürelerini ciddi düşürür)
RUN --mount=type=cache,target=/root/.npm \
  npm ci

############################
# dev (local compose)
############################
FROM deps AS dev
WORKDIR /app

ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .

EXPOSE 80
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "80"]

############################
# build (prod bundle)
############################
FROM deps AS build
WORKDIR /app

# Prod’da API route'ları zaten /v1/* ile çağrılıyor.
# Bu yüzden base URL domain root (/) olmalı.
ARG VITE_API_BASE_URL=/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY . .

RUN --mount=type=cache,target=/root/.npm \
  npm run build

############################
# prod runtime (nginx)
############################
FROM nginx:1.27-alpine AS runtime-prod
# nginx default html’i temizle
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html
# SPA + cache headers + healthz
COPY ./nginx/frontend.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
