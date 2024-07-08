
FROM node:18-alpine

WORKDIR /app

COPY .env ./

# Load the environment variables
ENV SOCKET_URL=$SOCKET_URL
ENV TOKEN=$TOKEN
ENV DOMAIN=$DOMAIN

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 7000

CMD ["npm", "start"]