/**
 * Api homepage
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns {Object}
 */
const index = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Welcome to Kouticket',
    }, null, 2)
  }
  
  return response;
}

export {
  index
}