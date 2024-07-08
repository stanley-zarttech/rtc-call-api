
FROM node:18-alpine

WORKDIR /app

# COPY .env ./

# Load the environment variables
ENV SOCKET_URL=$ENV SOCKET_URL=${Render_SECRETS_SOCKET_URL}
ENV TOKEN=${Render_SECRETS_TOKEN}
ENV DOMAIN=${Render_SECRETS_DOMAIN}

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 7000

CMD ["npm", "start"]