const { PrismaClient } = require('@prisma/client');
const JWT = require('jsonwebtoken');
const createResponse = require('../../createResponse');

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

const purchasesListHandler = async (request, h) => {
  try {
    // Dapatkan token dari header Authorization
    const { authorization } = request.headers;
    if (!authorization) {
      return createResponse(h, 401, 'error', 'Authorization header missing');
    }

    const token = authorization.replace('Bearer ', '');
    const decoded = JWT.verify(token, secret);

    const { learnerId } = decoded; // Mengambil learner_id dari token
    if (!learnerId) {
      return createResponse(h, 400, 'error', 'Invalid token: learnerId missing');
    }

    const {
      tutorIds, subject, days, times, learningMethod,
    } = request.payload;

    // Validasi payload
    if (!Array.isArray(tutorIds) || tutorIds.length === 0) {
      return createResponse(h, 400, 'error', 'tutorIds must be a non-empty array');
    }
    if (!subject || !Array.isArray(days) || !Array.isArray(times) || !learningMethod) {
      return createResponse(h, 400, 'error', 'Invalid payload');
    }

    // Iterasi melalui setiap tutorId dan periksa apakah sudah ada dalam wishlist
    const existingWishlist = await prisma.purchases.findMany({
      where: {
        tutor_id: {
          in: tutorIds,
        },
        learner_id: learnerId,
      },
      select: {
        tutor_id: true,
      },
    });

    const existingTutorIds = existingWishlist.map((entry) => entry.tutor_id);

    // Buat entri purchases hanya untuk tutorId yang belum ada dalam wishlist
    const newTutorIds = tutorIds.filter((tutorId) => !existingTutorIds.includes(tutorId));

    if (newTutorIds.length === 0) {
      return createResponse(h, 200, 'success', 'Tutors are already in your wishlist');
    }

    const purchasesData = newTutorIds.map((tutorId) => ({
      tutor_id: tutorId,
      learner_id: learnerId,
      subject,
      days: JSON.stringify(days),
      times: JSON.stringify(times),
      learning_method: learningMethod,
      status: null,
    }));

    // Buat entri purchases ke dalam database
    const purchasePromises = purchasesData.map((purchase) => prisma.purchases.create({ data: purchase }));
    const purchases = await Promise.all(purchasePromises);

    return h.response({
      status: 'success',
      message: 'Purchases created successfully',
      data: purchases,
    }).code(200);
  } catch (error) {
    console.error(error);
    return createResponse(h, 500, 'error', 'An error occurred while creating purchases', { error: error.message });
  }
};

module.exports = purchasesListHandler;
