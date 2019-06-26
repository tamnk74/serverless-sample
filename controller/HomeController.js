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

/**
 * S3 trigger to do something
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 * @returns {Object}
 */
const s3Trigger = async (event, context, callback) => {
	const bucketName = event.Records[0].s3.bucket.name;
  const keyName = event.Records[0].s3.object.key;
  const params = {Bucket: bucketName, Key: keyName};
  await userBusiness.updateDatabase(params);
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Welcome to Serverless',
    }, null, 2)
  }
  
  return response;
}

export {
  index
}