FROM node:slim

WORKDIR /BlogingPlatform

COPY package*.json ./
RUN npm install

COPY . .

CMD npm run start