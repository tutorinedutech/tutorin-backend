const midtransClient = require('midtrans-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const paymentStatusHandler = async (request, h) => {
  const notificationJson = request.payload;

  try {
    const statusResponse = await apiClient.transaction.notification(notificationJson);
    const {
      order_id: orderId,
      gross_amount: grossAmount,
      transaction_time: transactionTime,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
    } = statusResponse;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    const [learnerId, tutorId, createdAt] = orderId.split('-');

    let status;
    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      status = 'success';
    } else if (transactionStatus === 'settlement') {
      status = 'success';
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      status = 'failure';
    } else if (transactionStatus === 'pending') {
      status = 'pending';
    }

    const parsedCreatedAt = new Date(transactionTime);

    const newTransaction = await prisma.payment_transactions.create({
      data: {
        id: orderId,
        learner_id: parseInt(learnerId),
        tutor_id: parseInt(tutorId),
        amount: parseFloat(grossAmount),
        created_at: parsedCreatedAt,
        fraud_status: status,
      },
    });

    return h.response({
      status: 'success',
      data: newTransaction,
    }).code(200).type('application/json');
  } catch (error) {
    console.error(error);
    return h.response({
      status: 'error',
      message: 'An error occurred while processing the payment notification',
    }).code(500).type('application/json');
  }
};

module.exports = paymentStatusHandler;

// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const extractIds = (orderId) => {
//   const [learnerId, tutorId] = orderId.split('-');
//   return {
//     learnerId: parseInt(learnerId, 10),
//     tutorId: parseInt(tutorId, 10),
//   };
// };

// const paymentStatusHandler = async (request, h) => {
//   const {
//     transaction_time,
//     transaction_status,
//     order_id,
//     gross_amount,
//     fraud_status,
//     currency,
//     payment_type,
//     signature_key,
//     transaction_id,
//     status_code,
//     status_message,
//     merchant_id,
//     bill_key,
//     biller_code,
//     settlement_time,
//     expiry_time,
//     subject = null, // Nilai default null jika tidak disediakan
//     sessions = null, // Nilai default null jika tidak disediakan
//     price = null, // Nilai default null jika tidak disediakan
//   } = request.payload;

//   try {
//     // Parsing values
//     const { learnerId, tutorId } = extractIds(order_id);
//     const grossAmount = parseFloat(gross_amount);
//     const parsedCreatedAt = new Date(transaction_time);
//     const status = fraud_status;

//     // Membuat ID unik
//     const id = `${learnerId}-${tutorId}-${parsedCreatedAt.getTime()}`;

//     // Menyimpan ke database
//     const transaction = await prisma.payment_transactions.create({
//       data: {
//         id,
//         learner_id: learnerId,
//         tutor_id: tutorId,
//         amount: grossAmount,
//         created_at: parsedCreatedAt,
//         fraud_status: status,
//       },
//     });

//     return h.response({ message: 'Transaction saved successfully', transaction }).code(201);
//   } catch (error) {
//     console.error(error);
//     return h.response({ error: 'An error occurred' }).code(500);
//   }
// };

// module.exports = paymentStatusHandler;

// const midtransClient = require('midtrans-client');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const apiClient = new midtransClient.Snap({
//   isProduction: false,
//   serverKey: process.env.MIDTRANS_SERVER_KEY,
//   clientKey: process.env.MIDTRANS_CLIENT_KEY,
// });

// const extractIds = (orderId) => {
//   const [learnerId, tutorId] = orderId.split('-');
//   return {
//     learnerId: parseInt(learnerId, 10),
//     tutorId: parseInt(tutorId, 10),
//   };
// };

// const paymentStatusHandler = async (request, h) => {
//   try {
//     const notificationJson = request.payload; // Assuming notification is sent in the request payload

//     const {
//       transaction_time,
//       transaction_status,
//       order_id,
//       gross_amount,
//       fraud_status,
//       currency,
//       payment_type,
//       signature_key,
//       transaction_id,
//       status_code,
//       status_message,
//       merchant_id,
//       bill_key,
//       biller_code,
//       settlement_time,
//       expiry_time,
//       subject = null,
//       sessions = null,
//       price = null,
//     } = notificationJson;

//     // Parsing values
//     const { learnerId, tutorId } = extractIds(order_id);
//     const grossAmount = parseFloat(gross_amount);
//     const parsedCreatedAt = new Date(transaction_time);
//     const status = fraud_status;

//     // Membuat ID unik
//     const id = `${learnerId}-${tutorId}-${parsedCreatedAt.getTime()}`;

//     // Menyimpan ke database
//     const transaction = await prisma.payment_transactions.create({
//       data: {
//         id,
//         learner_id: learnerId,
//         tutor_id: tutorId,
//         amount: grossAmount,
//         created_at: parsedCreatedAt,
//         fraud_status: status,
//       },
//     });

//     return { message: 'Transaction saved successfully', transaction };
//   } catch (error) {
//     console.error(error);
//     throw new Error('An error occurred while handling notification');
//   }
// };

// module.exports = paymentStatusHandler;

// const fetch = require('node-fetch');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// const serverKey = 'YOUR_SERVER_KEY';
// const baseUrl = 'https://api.sandbox.midtrans.com/v2';

// // Fungsi untuk mendapatkan status transaksi dari Midtrans dan menyimpan ke database
// const paymentStatusHandler = async (request, h) => {
//   const getTransactionStatus = async (orderId) => {
//     const response = await fetch(`${baseUrl}/${orderId}/status`, {
//       headers: {
//         Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const data = await response.json();
//     return data;
//   };

//   const saveTransaction = async (transactionData) => {
//     const itemDetails = transactionData.item_details[0]; // Assuming item details is an array, and we need the first item
//     const transaction = {
//       id: transactionData.transaction_id,
//       learner_id: transactionData.customer_details.learner_id,
//       tutor_id: transactionData.customer_details.tutor_id,
//       subject: itemDetails.name,
//       sessions: itemDetails.quantity,
//       price: itemDetails.price,
//       amount: parseFloat(transactionData.gross_amount),
//       fraud_status: transactionData.fraud_status,
//       created_at: new Date(transactionData.transaction_time),
//     };

//     await prisma.payment_transactions.create({ data: transaction });
//     console.log('Transaction saved successfully');
//   };

//   const transactionData = request.payload;
//   try {
//     // Uncomment the line below if you need to fetch the transaction status from Midtrans
//     // const transactionData = await getTransactionStatus(request.params.orderId);
//     await saveTransaction(transactionData);
//     return h.response({ status: 'success' }).code(200);
//   } catch (error) {
//     console.error('Error:', error);
//     return h.response({ status: 'error', message: error.message }).code(500);
//   }
// };

// module.exports = paymentStatusHandler;
