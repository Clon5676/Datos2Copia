FROM node:14

WORKDIR /app

# Instalar netcat para usar en el script wait-for-it.sh
RUN apt-get update && apt-get install -y netcat

COPY package*.json ./

RUN npm install

COPY . .

# Copiar el script actualizado wait-for-it.sh
COPY wait-for-it.sh /app/

RUN chmod +x /app/wait-for-it.sh

EXPOSE 5000

# Cambiar el comando para ejecutar con wait-for-it usando netcat
CMD /app/wait-for-it.sh mysql && node index.js
