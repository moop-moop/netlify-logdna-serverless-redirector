/* eslint-disable no-console */
const { isEmpty, split, dropRight } = require('lodash');
const log = require('./logger');
const get404 = require('./get404');

// async function log(message, logLevel) {
//   logger.log(message, logLevel);
// }

// log('Message outside of Handler', 'info');

const fullpathMap = require('./fullpathMap');
const pathMap = require('./pathMap');

const filePath404 = './404.html';

exports.handler = async (event) => {
  try {
    // event.queryStringParameters.uri covers direct access for testing etc, event.path covers the use of proxying in Netlify
    const rawURIString = event.queryStringParameters.uri || event.path;
    // sanitize input uri
    const uriString = encodeURI(rawURIString);

    if (uriString === '/happy200') {
      log(
        {
          message: `Lets be happy ${uriString} returning a 200 response.`,
          status: 200,
          uri: uriString,
          userAgent: event.headers['user-agent']
        },
        'info'
      );
      return {
        statusCode: 200,
        body: `Does the happy 200 reponse Log correctly?`,
        headers: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'x-xss-protection': '1; mode=block',
          'x-frame-options': 'SAMEORIGIN'
        }
      };
    }

    let destination = fullpathMap()[uriString];
    let pathsArray;
    log(`Incoming request path: ${uriString}`, 'info');
    // console.log(`Incoming request path: ${uriString}`);
    if (isEmpty(destination)) {
      pathsArray = split(uriString, '/', 10);

      for (let i = 1; i < pathsArray.length - 1; i++) {
        const newPath = `${dropRight(pathsArray, i).join('/')}/`;
        destination = pathMap()[newPath];
        if (!isEmpty(destination)) {
          log(
            {
              message: `Redirector found a pathMap match for:${newPath}, going to:${destination}`,
              map: 'pathMap',
              status: 301,
              uri: uriString,
              destination,
              userAgent: event.headers['user-agent']
            },
            'info'
          );
          // console.log({
          //   message: `Redirector found a pathMap match for:${newPath}, going to:${destination}`,
          //   map: 'pathMap',
          //   status: 301,
          //   uri: uriString,
          //   destination,
          //   userAgent: event.headers['user-agent']
          // });

          break;
        }
      }
    } else {
      log(
        {
          message: `Redirector found a fullpathMap match for:${uriString}, going to:${destination}`,
          map: 'fullpathMap',
          status: 301,
          uri: uriString,
          destination,
          userAgent: event.headers['user-agent']
        },
        'info'
      );
      // console.log({
      //   message: `Redirector found a fullpathMap match for:${uriString}, going to:${destination}`,
      //   map: 'fullpathMap',
      //   status: 301,
      //   uri: uriString,
      //   destination,
      //   userAgent: event.headers['user-agent']
      // });
    }

    if (!isEmpty(destination)) {
      // exact matches and /section/path/* format entries
      // await once(logger, 'cleared');
      return {
        statusCode: 301,
        headers: {
          'Location': `${destination}`,
          'Cache-Control': 'public, max-age=0, must-revalidate',
          'x-xss-protection': '1; mode=block',
          'x-frame-options': 'SAMEORIGIN'
        }
      };
    }

    const html404 = get404(filePath404);
    log(
      {
        message: `No matches found for ${uriString} returning html from 404.html`,
        status: 404,
        uri: uriString,
        userAgent: event.headers['user-agent']
      },
      'info'
    );
    // console.log({
    //   message: `No matches found for ${uriString} returning html from 404.html`,
    //   status: 404,
    //   uri: uriString,
    //   userAgent: event.headers['user-agent']
    // });
    // await once(logger, 'cleared');
    return {
      statusCode: 404,
      body: html404,
      headers: {
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'x-xss-protection': '1; mode=block',
        'x-frame-options': 'SAMEORIGIN'
      }
    };
  } catch (err) {
    // const theError = JSON.stringify(err, Object.getOwnPropertyNames(err));
    log(err.message, 'error');
    // console.log(`Error message: ${JSON.stringify(err.message)}`);
    // await once(logger, 'cleared');
    return {
      statusCode: 500,
      body: 'There has been an error with this request. Please view logs to determine cause.'
    };
  }
};
