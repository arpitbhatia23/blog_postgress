FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

RUN npm test

EXPOSE 8000

CMD [ "npm","start"]