require('dotenv').config();
const Hapi = require('@hapi/hapi');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
const routes = require('./routes');
const validate = require('./validate');
const {
  scheduleCleanupTask,
} = require('./handlers/midtrans/deleteOldPendingPayments');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // register the HapiAuthJWT2 plugin on the server
  await server.register(HapiAuthJWT2);

  // create authentication strategy using jwt scheme
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  // set the default authentication strategy for all routes on the server
  server.auth.default('jwt');

  server.route(routes);

  // Schedule the cleanup task
  scheduleCleanupTask();

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
