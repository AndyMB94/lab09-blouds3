# Dockerfile

FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos del backend
COPY backend/ ./

# Instalar dependencias
RUN npm install

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["node", "app.js"]
