const midtransClient = require('midtrans-client');

const transactionHandler = async (request, h) => {
  const { learnerId, tutorId, subject, sessions, price } = request.payload;

  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY
  });

  let parameter = {
    "transaction_details": {
      "order_id": "YOUR-ORDERID-123456",
      "gross_amount": 10000
    },
    "credit_card": {
      "secure": true
    },
    "customer_details": {
      "first_name": "budi",
      "last_name": "pratama",
      "email": "budi.pra@example.com",
      "phone": "08111222333"
    }
  };
}

module.exports = transactionHandler;