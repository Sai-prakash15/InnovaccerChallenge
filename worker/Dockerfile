FROM node:10
WORKDIR /backend
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "worker.js"]
