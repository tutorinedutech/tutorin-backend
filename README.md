# JavaScript Backend API Using Hapi🏹

## Introduction 👋
We code using the JavaScript programming language and use Hapi as a backned framework. And for database interaction we use MySql Database Management and Prisma ORM to interact with the database. And to store unstructured data, we use Cloud Storage, which we usually use to store image and PDF data.

## Prerequisite 💪
- Node `21.7.3-alpine3.18`
- MySql `v.8.0`

## File Directory
- **.github/workflows** We use this folder to configure workflows using Github Actions, so that we will deploy when the main branch is pushed.
- **prisma** We use this folder to migrate the database using the Prisma ORM package.
- **src** In this folder we store all the resources we have such as handlers and servers.
- **handler** In this folder we store all the handlers we need such as learners, midtrans, and tutors.
- **learners** This folder functions to serve requests from Learners, where learners have the ability to singUp, search for tutors who they want to book as tutors, can access learner home profiles, and make changes to class sessions.
- **tutors** This folder functions to serve requests from tutors, where tutors have the ability to singUp, accept or reject teaching requests by learners, can access the tutor's home profile, and make changes to class sessions to validate the class being run.
- **midtrans** This folder functions to serve payment gateway requests from students, where when students make payment by entering the tutor they want to buy, number of sessions, subjects and price. Where the response will return a token to make payments via Midtrans. Apart from that, we will also record the input received from users and midtrans, so that we will create empty classes which will later be updated by the learner to determine the expected hours and adjusted by both parties.

## How To Use 🧐❓
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

## Routes 🤝
- `GET /`
-  `POST /signin`
-  `POST /signout`
-  `POST /signuptutors`
-  `POST /signuptutors`
-  `GET /tutors/home`
-  `GET /learners/home`
-  `POST /tutors`
-  `GET /tutors/{tutorId}`
-  `GET /tutors/my-profile`
-  `GET /learners/my-profile`
-  `PUT /tutors/my-profile`
-  `PUT /learners/my-profile`
- `DELETE /tutors/my-profile`
-  `POST /transactions`
-  `POST /payment-status`
-  `GET /class-details/detail-learning`
-  `GET /class-details/detail-tutoring`
-  `PUT /class-details/detail-learning/{classDetailsId}`
- `PUT /class-details/detail-tutoring/{classDetailsId}/schedule`
-  `POST /tutors/{tutorId}/reviews`
-  `PUT /tutors/{tutorId}/reviews`
-  `GET /tutors/top-rated`
-  `GET /class-details/{classSessionId}`
- `POST /tutors/purchases`
-  `PUT /tutors/purchases/{purchasesId}`
- `GET /tutors/purchases`
- `GET /tutors/purchases/{purchaseId}`

## Our Postman Template 😎

The link below is the documentation that we have created to be able to carry out integration and testing, where we have explained in detail how to use it and the conditions that are necessary and not necessary in order to get the response that we have set on the server.

[Postman TutorIn](https://documenter.getpostman.com/view/24374519/2sA3XLG5LF#deb2f0ee-829e-41d2-90a8-f100dbea3315)

![image](https://github.com/tutorinedutech/tutorin-backend/assets/128572429/04a39f45-bf14-4485-8832-a0cff4ac5f86)
