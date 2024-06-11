require('dotenv').config();
const Hapi = require('@hapi/hapi');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
const fs = require('fs');
const routes = require('./routes');
const validate = require('./validate');
const { scheduleCleanupTask } = require('./handlers/midtrans/deleteOldPendingPayments');

const init = async () => {
  // Read the SSL key and certificate from environment variables
  const tls = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };

  // Create the Hapi server instance with TLS configuration
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    tls: process.env.NODE_ENV !== 'production' ? undefined : tls, // Only use TLS in production
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register the HapiAuthJWT2 plugin on the server
  await server.register(HapiAuthJWT2);

  // Create authentication strategy using jwt scheme
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  // Set the default authentication strategy for all routes on the server
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
