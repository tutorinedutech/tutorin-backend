# Menggunakan image Node.js sebagai base
FROM node:21.7.3-alpine3.18

# Install curl untuk mengunduh Cloud SQL Auth Proxy
RUN apk add --no-cache curl

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

# Unduh dan install Cloud SQL Auth Proxy
RUN curl -o /cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 && \
    chmod +x /cloud_sql_proxy

# Menentukan port untuk aplikasi
EXPOSE 8080

# Command untuk menjalankan aplikasi dan Cloud SQL Auth Proxy
CMD ["/bin/sh", "-c", "/cloud_sql_proxy -instances=tutorin-424608:asia-southeast2:tutorin-db=tcp:3306 & npm run start-prod"]

# YOUR_INSTANCE_CONNECTION_NAME perlu diganti dengan nama instance Cloud SQL Anda.
