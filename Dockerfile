FROM node:slim

COPY *.js /tmp/timer/
COPY package-lock.json /tmp/timer/
COPY package.json /tmp/timer/
COPY routes /tmp/timer/routes/
COPY node_modules /tmp/timer/node_modules/
WORKDIR /tmp/timer/
EXPOSE 1337
CMD ["node", "index.js"]