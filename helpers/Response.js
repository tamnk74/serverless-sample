import HTTPStatus from 'http-status';

export default class Response {

  static success(data, code = HTTPStatus.OK) {
    const statusCode = code < 400 ? code : HTTPStatus.OK;
    return {
      statusCode: statusCode,

      // Required for CORS support to work
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'success',
        data
      }),
    };
  }

  static error(data, code = HTTPStatus.BAD_REQUEST) {
    const statusCode = code >= 400 ? code : HTTPStatus.BAD_REQUEST;
    return {
      statusCode: statusCode,

      // Required for CORS support to work
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        status: 'fail',
        data
      }),
    };
  }
}