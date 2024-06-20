# JavaScript Backend API Using Hapi

## Introduction 👋
We code using the JavaScript programming language and use Hapi as a backned framework. And for database interaction we use MySql Database Management and Prisma ORM to interact with the database. And to store unstructured data, we use Cloud Storage, which we usually use to store image and PDF data.

## Prerequisite
- Node `21.7.3-alpine3.18`
- MySql `v.8.0`

## How To Use
1. `git clone https://github.com/tutorinedutech/tutorin-backend.git`
2. `cd tutorin-backend`
3. `nano .env`
4. configure .env with your Mysql, Midtrans, and Prisma.

```bash
### database

DATABASE_URL = YOUR_DATABASE_URL

### Google Cloud Storageprod

GOOGLE_PROJECT_ID = YOUR_PROJECT_ID

GOOGLE_APPLICATION_CREDENTIALS = YOUR_APPLICATION_CREDENTIALS

GOOGLE_BUCKET_NAME = YOUR_BUCKET_NAME

### token signing key

JWT_SECRET= YOUR_JWT_SECRET

### midtrans

MIDTRANS_PUBLIC_API = YOUR_MIDTRANS_PUBLIC_API

MIDTRANS_SERVER_KEY = YOUR_MIDTRANS_SERVER_KEY

MIDTRANS_CLIENT_KEY = YOUR_MIDTRANS_CLIENT_KEY

### PORT

PORT = YOUR_PORT
```
 
5.  Open terminal, follow the steps below:
    - Install all depedencies `npm install`.
    - Connect your database `mysql -h YOUR_DATABASE_IP -u root -p`
    - Create your database `CREATE DATABASE YOU_DATABASE_NAME;`
    - Migrateyour database `npx prisma migrate dev --name init`.
    - Create Cloud Sql using MySql `v.8.0` and region `Jakarta (asia-southeast2)` for better latency.
    - Create Reverse IP for stability.
7.  NPM RUN START-PROD

## Routes
1. `GET /`
2. `POST /signin`
3. `POST /signout`
4. `POST /signuptutors`
5. `POST /signuptutors`
6. `GET /tutors/home`
7. `GET /learners/home`
8. `POST /tutors`
9. `GET /tutors/{tutorId}`
10. `GET /tutors/my-profile`
11. `GET /learners/my-profile`
12. `PUT /tutors/my-profile`
13. `PUT /learners/my-profile`
14. `DELETE /tutors/my-profile`
15. `POST /transactions`
16. `POST /payment-status`
17. `GET /class-details/detail-learning`
18. `GET /class-details/detail-tutoring`
19. `PUT /class-details/detail-learning/{classDetailsId}`
20. `PUT /class-details/detail-tutoring/{classDetailsId}/schedule`
21. `POST /tutors/{tutorId}/reviews`
22. `PUT /tutors/{tutorId}/reviews`
23. `GET /tutors/top-rated`
24. `GET /class-details/{classSessionId}`
25. `POST /tutors/purchases`
26. `PUT /tutors/purchases/{purchasesId}`
27. `GET /tutors/purchases`
28. `GET /tutors/purchases/{purchaseId}`
