const midtransClient = require('midtrans-client');
const { PrismaClient } = require('@prisma/client');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const paymentStatusHandler = async (request, h) => {
  const notificationJson = request.payload;
  console.log(notificationJson);
  try {
    console.log('hello_0');
    const statusResponse = await apiClient.transaction.notification(notificationJson);
    console.log('hello_1');
    const {
      order_id: orderId,
      gross_amount: grossAmount,
      transaction_time: transactionTime,
      transaction_status: transactionStatus,
    } = statusResponse;
    console.log('hello_2');
    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}`);

    const [learnerId, tutorId, createdAt] = orderId.split('-');
    console.log('hello_3');
    let status;
    if (transactionStatus === 'capture') {
      status = 'success';
    } else if (transactionStatus === 'settlement') {
      status = 'success';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'failure';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    }
    console.log('hello_4');
    const parsedCreatedAt = new Date(transactionTime);
    let newTransaction;

    if (status === 'success') {
      const pendingPayment = await prisma.pending_payments.findUnique({
        where: {
          id: orderId,
        },
      });

      if (pendingPayment) {
        newTransaction = await prisma.payment_transactions.create({
          data: {
            id: orderId,
            learner_id: parseInt(learnerId),
            tutor_id: parseInt(tutorId),
            amount: parseFloat(grossAmount),
            created_at: parsedCreatedAt,
            sessions: pendingPayment.sessions,
            subject: pendingPayment.subject,
            price: pendingPayment.price,
          },
        });
        console.log(newTransaction);

        // Create a new class session record
        const newClassSession = await prisma.class_sessions.create({
          data: {
            learner_id: parseInt(learnerId),
            tutor_id: parseInt(tutorId),
            sessions: pendingPayment.sessions,
            subject: pendingPayment.subject,
          },
        });
        console.log(newClassSession);
      }
    }

    return createResponse(h, 200, 'success', 'Success to saved transaction', newTransaction).code(200).type('application/json');
  } catch (error) {
    // console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while processing the payment notification').code(500).type('application/json');
  }
};

module.exports = paymentStatusHandler;