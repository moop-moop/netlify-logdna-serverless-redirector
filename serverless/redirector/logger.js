/* eslint-disable no-console */
const logdna = require('@logdna/logger');

console.log(
  `context:${process.env.CONTEXT}, build_id:${process.env.BUILD_ID}, review_id:${process.env.REVIEW_ID}, pull_request:${process.env.PULL_REQUEST}, branch:${process.env.BRANCH}, deploy_prime_url:${process.env.DEPLOY_PRIME_URL}`
);

const options = {
  env: 'fake-env',
  app: 'redirector',
  level: 'info', // default level if not set in request
  hostname: process.env.SITE_NAME || 'Netlify',
  tags: ['netlify', 'function'],
  indexMeta: true,
  flushIntervalMs: 5
};

console.log(`options: ${JSON.stringify(options)}`);

const loggerImpl = logdna.createLogger(process.env.LOGDNA_API_KEY, options);

console.log(` loggerImpl: ${JSON.stringify(loggerImpl)}`);

module.exports = async function logger(message, logLevel) {
  console.log(`I am the logger logging: ${message} @ level ${logLevel}`);
  loggerImpl.log(message, logLevel);
};
