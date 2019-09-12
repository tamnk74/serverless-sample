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
      message: 'Welcome to Serverless',
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

/**
   * Upload file to S3
   * @param {Object} data
   * @param {Object} imageBase64
   */
  async uploadS3(data, imageBase64) {
    const buffer = Buffer.from(imageBase64, 'base64');
    const resizeBuffer = await sharp(buffer).resize(MAX_WIDTH, MAX_HEIGHT).toBuffer();
    // Upload resize image
    const paramThumbnail = {
      Bucket: config.s3Bucket + '/images/shows/' + data.client_id,
      Key: data.show_no + '_t.png',
      Body: resizeBuffer,
      ContentEncoding: 'base64'
    };
    console.log('Uploading...', paramThumbnail);
    let result = await new Promise((resolve, reject) => {
      s3.putObject(paramThumbnail, function (err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err);
        } else {
          console.log(data);
          resolve(data);
        }
      });
    });
    console.log('Uploaded ', paramThumbnail, result);
  }

export {
  index
}