const _g = require('@jest/globals');

const helloWorld = require('./hello-world').handler;

_g.describe('hello-world', () => {
  it('should return error if failure passed in', async () => {
    const event = {
      queryStringParameters: {
        name: 'failure'
      }
    };
    const result = await helloWorld(event);
    _g.expect(result.statusCode).toEqual(500);
    _g.expect(result.body).toEqual('Error: Failure!');
  });
  _g.it('Should return a named message', async () => {
    const event = {
      queryStringParameters: {
        name: 'Dave'
      }
    };
    const result = await helloWorld(event);
    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello Dave. ARE YOU HAVING A NICE DAY'
      }),
      headers: { 'Content-Type': 'application/json' }
    };
    _g.expect(result).toEqual(expectedResult);
  });
});
