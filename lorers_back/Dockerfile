FROM node:22-alpine

WORKDIR /app

# Instalar dependencias (incluyendo devDependencies para ts-node)
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY tsconfig.json ./
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "--loader", "ts-node/esm", "src/index.ts"]
