# Gunakan Node.js versi yang sesuai dengan Alpine sebagai base image
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

# Install Cloud SQL Proxy
RUN apk add --no-cache libc6-compat
RUN wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O /cloud_sql_proxy \
    && chmod +x /cloud_sql_proxy

# Expose the application port
EXPOSE 8080

# Command to run the application with Cloud SQL Proxy
CMD ["/cloud_sql_proxy", "-instances=tutorin-424608:asia-southeast2:tutorin-db=tcp:3306", "&", "npm", "run", "start-prod"]