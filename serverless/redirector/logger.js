/* eslint-disable no-console */
const logdna = require('@logdna/logger');
const { once } = require('events');

// console.log(
//   `context:${process.env.CONTEXT}, build_id:${process.env.BUILD_ID}, review_id:${process.env.REVIEW_ID}, pull_request:${process.env.PULL_REQUEST}, branch:${process.env.BRANCH}, deploy_prime_url:${process.env.DEPLOY_PRIME_URL}`
// );

const options = {
  env: 'fake-env',
  app: 'redirector',
  level: 'info', // default level if not set in request
  hostname: process.env.SITE_NAME || 'Netlify',
  tags: ['netlify', 'function'],
  indexMeta: true,
  flushIntervalMs: 5,
  timeout: 3000
};

// console.log(`options: ${JSON.stringify(options)}`);

const logger = logdna.createLogger(process.env.LOGDNA_API_KEY, options);

// console.log(` loggerImpl: ${JSON.stringify(loggerImpl)}`);

// Override console methods to send logs to both LogDNA and stdout/stderr
// const { log: consoleLog, error: consoleError } = console;
// const { error: consoleError } = console;
const { log: consoleLog } = console;

const dualLog = (message, logLevel) => {
  logger.log(message, logLevel);
  consoleLog(`${logLevel}: ${JSON.stringify(message, undefined, 2)}`);
};

// console.error = function error(message) {
//   logger.error(message);
//   consoleError(message);
// };

// logger.on('error', consoleError);
logger.on('error', console.error);

module.exports = async function log(message, logLevel) {
  // console.log(`I am the logger logging: ${message} @ level ${logLevel}`);
  // if (logLevel === 'error') {
  //   console.error(message);
  // } else {
  //   console.log(message, logLevel);
  // }
  // logger.log(message, logLevel);
  dualLog(message, logLevel);
  // Ensure logs have been flushed to LogDNA before finishing
  // await logger.flush();
  await once(logger, 'cleared');
  return true;
};
