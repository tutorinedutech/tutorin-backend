const midtransClient = require('midtrans-client');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const transactionHandler = async (request, h) => {
  const {
    learnerId, tutorId, subject, sessions, price,
  } = request.payload;

  const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);

  try {
    const learner = await prisma.learners.findUnique({
      where: { id: parseInt(learnerId) },
    });

    if (!learner) {
      return createResponse(h, 404, 'error', 'Learner not found');
    }

    const learnerUser = await prisma.users.findUnique({
      where: { id: parseInt(learner.user_id) },
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
      where: { id: parseInt(tutor.user_id) },
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
        learner_id: parseInt(learnerId),
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

module.exports = transactionHandler;
