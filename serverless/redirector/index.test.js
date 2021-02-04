const { describe, expect, it } = require('@jest/globals');
const redirector = require('./index').handler;
// let logger = require('./logger');
const fullpathMap = require('./fullpathMap');
const pathMap = require('./pathMap');
const { mockFullpathMap, mockPathMap, responses, notFoundResponse } = require('./index.mock');
const get404 = require('./get404');

beforeAll(() => {
  // jest.mock(logger.log, () => jest.fn());
  // logger.mockImplementation(() => jest.fn());
  // jest.mock('./logger');
  // logger = { log: jest.fn() };
});

// jest.mock('log', () => jest.fn());
// jest.spyOn(logger, logger.log);

// mocking the redirtect maps
jest.mock('./fullpathMap', () => jest.fn());
jest.mock('./pathMap', () => jest.fn());
fullpathMap.mockImplementation(() => mockFullpathMap);
pathMap.mockImplementation(() => mockPathMap);

jest.mock('./get404', () => jest.fn());
get404.mockReturnValue('<!DOCTYPE html><html><head></head><body>Not Found</body></html>');

describe('serverless-function-redirector', () => {
  it('Errors are caught', async () => {
    const event = {};
    const result = await redirector(event);
    expect(result.statusCode).toEqual(500);
  });

  test.each([
    '/here/nested/1234',
    '/youarehere/nested/very-nested/6789',
    '/path-root/nested/path/1234',
    '/another-path-root/nested/very/nested/pat'
  ])(
    '%s should match mocked status code and headers',
    async (path) => {
      const event = {
        path,
        headers: { 'user-agent': 'mock-agent' },
        queryStringParameters: {}
      };
      const result = await redirector(event);
      expect(result.statusCode).toEqual(responses[path].statusCode);
      expect(result.headers).toEqual(responses[path].headers);
    },
    1000
  );

  it('Should be mocked 404 page with matching headers', async () => {
    const event = {
      path: '/i-do-not-exist',
      headers: { 'user-agent': 'mock-agent' },
      queryStringParameters: {}
    };
    const result = await redirector(event);
    expect(result.statusCode).toEqual(notFoundResponse.statusCode);
    expect(result.headers).toEqual(notFoundResponse.headers);
  });
});
