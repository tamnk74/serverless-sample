import fs from 'fs';
import config from '../config';
import csv from 'fast-csv';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const MAX_WIDTH = 240;
const MAX_HEIGHT = 200;

class File {

  /**
   * Function load file sql
   *
   * @param {string} sqlFile
   * @param {string} [pathFolder='sql']
   * @returns {string}
   * @memberof File
   */
  async loadSql(sqlFile, pathFolder = 'sql', jpEncode = false) {
    // Add config path of file SQL
    if (pathFolder == null || typeof pathFolder === "undefined") {
      pathFolder = config.sqlPath;
    }

    // Add encode file to jis-shift
    if (jpEncode) {
      const file = fs.readFileSync(pathFolder + '/' + sqlFile);
      var content = iconv.decode(Buffer.from(file), "Shift_JIS")
    } else {
      var content = fs.readFileSync(pathFolder + '/' + sqlFile).toString();
    }
    return content;
  }

  /**
   * Load data from csv
   *
   *
   * @param {String} path
   * @returns {Promise<*>}
   */
  async loadCSV(path) {
    return new Promise(function (resolve, reject) {
      let results = [];
      try {
        console.log(`Start reading file csv: ${path}`);
        csv
          .fromPath(path, {delimiter: ';', trim: true})
          .on("data", function (data) {
            results.push({
              id: data[0],
              name: data[1],
            });
          })
          .on('end', () => {
            console.log(`CSV file successfully processed with ${results.length} records`);
            resolve(results);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Read csv file from S3
   *
   * @param {Object} params S3 config
   * @returns {Promise<void>}
   */
  async readCSVS3(params) {
    return new Promise(function (resolve, reject) {
      const results = [];
      try {
        console.log(`Start reading file csv: `, params);
        const stream = s3.getObject(params).createReadStream();
        csv.fromStream(stream, {delimiter: ';', trim: true})
          .on("data", function (data) {
            results.push({
              id: data[0] || '',
              name: data[1] || '',
            });
          })
          .on('end', () => {
            console.log(`Read successfully with ${results.length} records`);
            resolve(results);
          });
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
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
    const result = await new Promise((resolve, reject) => {
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
}

export {File}