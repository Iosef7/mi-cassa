FROM node:20-alpine

# Instalar dependencias requeridas por Prisma en Alpine
RUN apk add --no-cache openssl ca-certificates curl

WORKDIR /app

# Copiar archivos raíz necesarios para el Prisma Client
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias raíz y generar el cliente Prisma
# Esto asegura que '../prisma/generated/client' esté disponible
RUN npm install
RUN npx prisma generate

# Cambiar al subdirectorio del bot
WORKDIR /app/whatsapp-bot

# Instalar las dependencias específicas del bot
COPY whatsapp-bot/package*.json ./
RUN npm install

# Copiar el código fuente del bot
COPY whatsapp-bot/ ./

# Variables de entorno
ENV BOT_PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "index.js"]
