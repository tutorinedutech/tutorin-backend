// cleanup.js
const { PrismaClient } = require('@prisma/client');
const cron = require('node-cron');

const prisma = new PrismaClient();

const deleteOldPendingPayments = async () => {
  try {
    const result = await prisma.pending_payments.deleteMany({});

    console.log(`Deleted ${result.count} old pending payments`);
    return {
      status: 'success',
      message: 'Deleted old pending payments',
      data: { deleted_count: result.count },
    };
  } catch (error) {
    console.error('Error deleting old pending payments:', error);
    return {
      status: 'error',
      message: 'Error deleting old pending payments',
      data: { error },
    };
  }
};

// Schedule the task to run every hour
const scheduleCleanupTask = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('Running the cleanup task...');
    deleteOldPendingPayments();
  });
};

module.exports = { scheduleCleanupTask, deleteOldPendingPayments };
