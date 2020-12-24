FROM node:14.15.3-buster

WORKDIR /app

RUN yarn global add http-server

COPY package.json yarn.lock ./
RUN yarn install --pure-lockfile --network-timeout 600000

COPY src/ /app/src
COPY public/ /app/public
RUN yarn build

EXPOSE 3000

CMD ["http-server", "-p", "3000", "/app/build"]
