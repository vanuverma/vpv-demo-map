FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src/ ./src/

# Ensure the data directory exists so SQLite can create the database file
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "src/index.js"]
