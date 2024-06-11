FROM node:21.7.3-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start-prod"]