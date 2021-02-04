const mockFullpathMap = {
  '/here/nested/1234': '/there/nested',
  '/youarehere/nested/very-nested/6789': '/also-there/place'
};

const mockPathMap = {
  '/path-root/': '/all-path-root-go-here',
  '/another-path-root/nested/': '/another-path-goes/here'
};

const responses = {
  '/here/nested/1234': {
    statusCode: 301,
    headers: {
      'Location': '/there/nested',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'SAMEORIGIN'
    }
  },
  '/youarehere/nested/very-nested/6789': {
    statusCode: 301,
    headers: {
      'Location': '/also-there/place',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'SAMEORIGIN'
    }
  },
  '/path-root/nested/path/1234': {
    statusCode: 301,
    headers: {
      'Location': '/all-path-root-go-here',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'SAMEORIGIN'
    }
  },
  '/another-path-root/nested/very/nested/pat': {
    statusCode: 301,
    headers: {
      'Location': '/another-path-goes/here',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'x-xss-protection': '1; mode=block',
      'x-frame-options': 'SAMEORIGIN'
    }
  }
};

const notFoundResponse = {
  statusCode: 404,
  headers: {
    'Cache-Control': 'public, max-age=0, must-revalidate',
    'x-xss-protection': '1; mode=block',
    'x-frame-options': 'SAMEORIGIN'
  }
};

module.exports = { mockFullpathMap, mockPathMap, responses, notFoundResponse };
