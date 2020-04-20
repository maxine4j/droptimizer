FROM node:13-alpine

WORKDIR /app

RUN apk update && apk add python

COPY ./Droptimizer/package.json ./Droptimizer/yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000

COPY ./Droptimizer/ ./

EXPOSE 3000

CMD ["node", "/app/bin/www"]