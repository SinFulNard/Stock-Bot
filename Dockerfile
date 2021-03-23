FROM node:14

WORKDIR /usr/src/app

COPY package.json .

RUN npm install
RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "node", "bot.js" ]
