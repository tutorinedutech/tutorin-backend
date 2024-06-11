FROM node:21.7.3-alpine3.18

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 5000

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

# Build the application (if using TypeScript, transpile to JavaScript)
RUN npm run build

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "start-prod"]