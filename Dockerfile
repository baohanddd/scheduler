FROM node:slim
ADD . /var/timer
RUN npm install
WORKDIR /var/timer
EXPOSE 1337
CMD ["node", "index.js"]