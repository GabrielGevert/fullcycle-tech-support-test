FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Comando para iniciar com nodemon e também o ts.
CMD ["npx", "nodemon", "--watch", "./", "--exec", "npx ts-node ./server.ts", "-e", "ts"]
