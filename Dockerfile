FROM node:18-alpine

# Install SQLite dependencies
RUN apk add --no-cache sqlite sqlite-dev python3 make g++ build-base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Create data directory for SQLite database
RUN mkdir -p data && chmod 777 data

# Set environment variables
ENV NODE_ENV=production
ENV SQLITE_DB_PATH=/app/data/items.db

# Expose port
EXPOSE 2019

# Start the application
CMD ["node", "index.js"]