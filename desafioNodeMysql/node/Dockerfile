FROM node:18-slim

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install && npm update

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
