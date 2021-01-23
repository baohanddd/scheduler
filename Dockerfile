FROM node:slim
ADD . /var/timer
WORKDIR /var/timer
EXPOSE 1337
CMD ["node", "index.js"]