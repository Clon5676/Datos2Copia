# Usar la imagen oficial de Node.js
FROM node:14

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias del frontend
RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Exponer el puerto 3000 para el servidor de desarrollo de React
EXPOSE 3000

# Comando para iniciar el servidor de desarrollo de React
CMD ["npm", "start"]
