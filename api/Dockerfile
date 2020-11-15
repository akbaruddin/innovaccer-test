FROM node:latest

RUN mkdir -p /usr/api

WORKDIR /usr/api

COPY package.json /usr/api

RUN yarn

COPY . /usr/api

EXPOSE 8080

CMD ["yarn", "start"]
