const JWT = require('jsonwebtoken');
const midtransClient = require('midtrans-client');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const secret = process.env.JWT_SECRET;
const prisma = new PrismaClient();

const transactionsHandler = async (request, h) => {
  const { authorization } = request.headers;
  if (!authorization) {
    return createResponse(h, 401, 'error', 'Authorization header missing');
  }

  const token = authorization.replace('Bearer ', '');
  const decoded = JWT.verify(token, secret);

  const { learnerId } = decoded;

  if (!learnerId) {
    return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
  }

  const {
    tutorId, subject, sessions, price,
  } = request.payload;

  // Validasi jumlah sesi
  // if (sessions > 10) {
  //   return createResponse(h, 400, 'error', 'Jumlah sesi tidak boleh lebih dari 10').code(400).type('application/json');
  // }

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

  try {
    const learner = await prisma.learners.findUnique({
      where: { id: learnerId },
    });

    if (!learner) {
      return createResponse(h, 404, 'error', 'Learner not found');
    }

    const learnerUser = await prisma.users.findUnique({
      where: { id: learner.user_id },
    });

    if (!learnerUser) {
      return createResponse(h, 404, 'error', 'Learner user not found');
    }

    const learnerEmail = learnerUser.email;
    const learnerName = learner.name.split(' ');

    const tutor = await prisma.tutors.findUnique({
      where: { id: parseInt(tutorId) },
    });

    if (!tutor) {
      return createResponse(h, 404, 'error', 'Tutor not found');
    }

    const tutorUser = await prisma.users.findUnique({
      where: { id: tutor.user_id },
    });

    if (!tutorUser) {
      return createResponse(h, 404, 'error', 'Tutor user not found');
    }

    const tutorEmail = tutorUser.email;
    const tutorName = tutor.name.split(' ');

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
    });

    const parameter = {
      transaction_details: {
        order_id: `${learnerId}-${tutorId}-${timestamp}`,
        gross_amount: sessions * price,
      },
      credit_card: {
        secure: true,
      },
      item_details: [{
        id: `${learnerId}-${tutorId}-${timestamp}`,
        price,
        quantity: sessions,
        name: subject,
      }],
      customer_details: {
        first_name: learnerName[0],
        last_name: learnerName.slice(1).join(' '),
        email: learnerEmail,
        phone: learner.phone_number,
        billing_address: {
          address: learner.domicile,
        },
        shipping_address: {
          first_name: tutorName[0],
          last_name: tutorName.slice(1).join(' '),
          email: tutorEmail,
          phone: tutor.phone_number,
          address: tutor.domicile,
        },
      },
    };

    await prisma.pending_payments.create({
      data: {
        id: parameter.transaction_details.order_id,
        learner_id: learnerId,
        tutor_id: parseInt(tutorId),
        subject,
        sessions,
        price,
      },
    });

    const transaction = await snap.createTransaction(parameter);
    return createResponse(h, 201, 'success', 'successfully made a payment token request', {
      transaction,
    });
  } catch (error) {
    return createResponse(h, 500, 'error', 'failed to create transaction', { error: error.message });
  }
};

module.exports = transactionsHandler;
