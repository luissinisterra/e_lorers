# ── Etapa 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Etapa 2: Serve con Nginx ──────────────────────────────────────────────────
FROM nginx:alpine

# Copiar el resultado del build (Angular 19+ genera en dist/<name>/browser/)
COPY --from=builder /app/dist/lorers_front/browser /usr/share/nginx/html

# Configuración de Nginx con soporte SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
