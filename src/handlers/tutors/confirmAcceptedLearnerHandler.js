const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const confirmAcceptedLearnerHandler = async (request, h) => {
  try {
    // Dapatkan token dari header Authorization
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { tutorId } = decoded; // Mengambil tutorId dari token
    if (!tutorId) {
      return createResponse(h, 400, 'error', 'Invalid token: tutorId missing');
    }

    // Ambil purchasesId dari request params
    const { purchasesId } = request.params;

    // Cek apakah purchasesId valid
    const purchase = await prisma.purchases.findUnique({
      where: {
        id: parseInt(purchasesId, 10),
      },
    });

    if (!purchase) {
      return createResponse(h, 404, 'error', 'Purchase not found');
    }

    // Periksa apakah tutor yang sedang memperbarui memiliki akses ke entri ini
    if (purchase.tutor_id !== tutorId) {
      return createResponse(h, 403, 'error', 'Unauthorized access to purchase');
    }

    // Jika status sudah tidak null, beri pesan bahwa pembelian tidak dapat diedit
    if (purchase.status !== null) {
      return createResponse(h, 400, 'error', 'Purchase status cannot be edited');
    }

    // Ambil status baru dari payload
    const { status } = request.payload;

    // Validasi status
    if (status !== 'accepted' && status !== 'declined') {
      return createResponse(h, 400, 'error', 'Invalid status value');
    }

    // Lakukan update status pada entri purchases
    const updatedPurchase = await prisma.purchases.update({
      where: {
        id: parseInt(purchasesId, 10),
      },
      data: {
        status,
      },
    });

    return createResponse(h, 200, 'success', 'Purchase status updated successfully', updatedPurchase);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while updating purchase status', { error: error.message });
  }
};

module.exports = confirmAcceptedLearnerHandler;
