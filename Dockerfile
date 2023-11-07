FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

USER node

ENV MONGO_URL="mongodb+srv://codeskul:d2ODKdqURk647iwd@nasa-project-cluster.5teoawg.mongodb.net/?retryWrites=true&w=majority"

CMD [ "npm", "start" ]

EXPOSE 8000