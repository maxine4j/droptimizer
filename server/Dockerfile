FROM node:14.15.3-buster

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000

COPY ./src /app/src
COPY ./data.db /app/data.db

EXPOSE 3000

CMD ["node", "/app/src/www"]
