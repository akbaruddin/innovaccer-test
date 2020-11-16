FROM node:14.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i && mv node_modules ../

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
