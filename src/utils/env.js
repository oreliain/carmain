// eslint-disable-next-line @typescript-eslint/no-var-requires
const Dotenv = require('dotenv');
const ENV = Dotenv.config().parsed;

module.exports = function getEnvConfig() {
  let prefix = process.env.NODE_ENV === 'development' ? 'DEV' : false;
  if (!prefix) {
    prefix = process.env.FIREBASE_ENV.toUpperCase();
    if (!['DEV' /*, 'STAGE', 'PROD'*/].includes(prefix)) {
      throw Error(`Unknown or not supplied environment variable "${prefix}"`);
    }
  }
  return {
    FIREBASE: {
      apiKey: ENV[`${prefix}_API_KEY`],
      authDomain: ENV[`${prefix}_AUTH_DOMAIN`],
      databaseURL: ENV[`${prefix}_DATA_BASE_URL`],
      projectId: ENV[`${prefix}_PROJECT_ID`],
      storageBucket: ENV[`${prefix}_STORAGE_BUCKET`],
      messagingSenderId: ENV[`${prefix}_MESSAGING_SENDER_ID`],
      appId: ENV[`${prefix}_APP_ID`],
    },
  };
};
