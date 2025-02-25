FROM node:alpine3.20

WORKDIR /app

USER root

COPY package*.json .


RUN npm install 

COPY . .

EXPOSE 8050

CMD ["npm", "start"]
