import fs from 'fs';
import config from '../config';
import csv from 'fast-csv';
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

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
              map_id: data[0],
              hall_nm_kana: data[1],
              hall_nm: data[2],
              prefecture: data[6],
              address: data[7],
              tel_no: data[12],
              url: data[15],
              room_1: data[48],
              room_2: data[67],
              room_3: data[86],
              room_4: data[105],
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

export {File}