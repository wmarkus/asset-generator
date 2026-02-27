# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Optional build-time env for client-side Krea integration.
ARG VITE_KREA_API_KEY
ENV VITE_KREA_API_KEY=${VITE_KREA_API_KEY}

RUN npm run build

FROM nginx:1.27-alpine AS runtime

# SPA fallback + cache headers for static assets
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
