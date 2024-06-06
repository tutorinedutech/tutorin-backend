const midtransClient = require('midtrans-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Initialize Core API client
const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Handler function
const getPaymentStatus = async (req, res) => {
  const { transactionId } = req.params;

  try {
    // Get transaction status from Midtrans
    const transactionStatus = await coreApi.transaction.status(transactionId);

    // Extract necessary data
    const { order_id, gross_amount, transaction_time } = transactionStatus;

    // Here we assume that the order_id format is like "learnerId-tutorId"
    const [learnerId, tutorId] = order_id.split('-').map(Number);

    // Save transaction to the database
    const newTransaction = await prisma.transactions_in.create({
      data: {
        learner_id: learnerId,
        tutor_id: tutorId,
        total: parseFloat(gross_amount),
        created_at: new Date(transaction_time),
      },
    });

    res.status(200).json({
      status: 'success',
      data: newTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the payment status',
    });
  }
};

module.exports = getPaymentStatus;
