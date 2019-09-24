FROM node:10-alpine

RUN npm i cnpm -g
RUN cnpm i pm2 -g