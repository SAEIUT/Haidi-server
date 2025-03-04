FROM node:20-alpine
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:web
EXPOSE 80
CMD ["/bin/sh", "-c", "node bin/migrate.js && npm start"]