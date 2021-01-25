FROM node:slim
ADD . /var/timer
WORKDIR /var/timer
RUN npm install
EXPOSE 1337
CMD ["node", "index.js"]