# JavaScript Backend API Using Hapi

## Introduction 👋
We code using the JavaScript programming language and use Hapi as a backned framework. And for database interaction we use MySql Database Management and Prisma ORM to interact with the database. And to store unstructured data, we use Cloud Storage, which we usually use to store image and PDF data.

## Prerequisite
- Node `21.7.3-alpine3.18`
- MySql `v.8.0`

## How To Use
1. git clone `https://github.com/tutorinedutech/tutorin-backend.git`
2. cd tutorin-backend
3. nano .env
4. configure .env with your Mysql, Midtrans, and Prisma.

### database

`DATABASE_URL = "mysql://root:@localhost:3306/tutorin"`

### Google Cloud Storageprod

`GOOGLE_PROJECT_ID = YOUR_PROJECT_ID`

`GOOGLE_APPLICATION_CREDENTIALS = YOUR_APPLICATION_CREDENTIALS`

`GOOGLE_BUCKET_NAME = YOUR_BUCKET_NAME`

### token signing key

`JWT_SECRET= YOUR_JWT_SECRET`

### midtrans

`MIDTRANS_PUBLIC_API = YOUR_MIDTRANS_PUBLIC_API`

`MIDTRANS_SERVER_KEY = YOUR_MIDTRANS_SERVER_KEY`

`MIDTRANS_CLIENT_KEY = YOUR_MIDTRANS_CLIENT_KEY`

### PORT

`PORT = YOUR_PORT`
 
5.  Open terminal, follow the steps below:
    - install all depedencies
    - Connect your database and migrate
    - 
7.  NPM RUN START-PROD

