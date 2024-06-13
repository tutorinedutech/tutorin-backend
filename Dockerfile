FROM node:21.7.3-alpine3.18

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start-prod"]