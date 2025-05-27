FROM node:18-alpine

# Install SQLite dependencies
RUN apk add --no-cache sqlite

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Create data directory for SQLite database
RUN mkdir -p data

# Expose port
EXPOSE 2019

# Set environment variables with default values
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD=
ENV PORT=2019

# Start the application
CMD ["node", "index.js"]