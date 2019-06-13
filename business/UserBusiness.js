import {sequelize} from '../models';
import { user } from '../models';
import BaseBusiness from './BaseBusiness';
import {File} from '../helpers/File';
import {userBusiness} from '../business';

export default class UserBusiness extends BaseBusiness {
  constructor() {
    super(user);
    this.fileHelper = new File();
  }

  /**
   * Updating all hall data from csv on S3
   * @param params S3 config
   * @returns {Promise<void>}
   */
  async updateDatabase(params) {
    await sequelize.transaction(async t => {
      // Remove all records
      const sqlRemove = '';
      const resultDelete = await sequelize.query(sqlRemove, {
        type: sequelize.QueryTypes.DELETE,
        transaction: t
      });
      console.log('Removed', resultDelete);
      // Insert new records
      const data = await this.fileHelper.readCSVS3(params);
      const sqlInsert = '';
      console.log('Start inserting ' + data.length + ' records');
      data.forEach(async (dt, index) => {
        let res = await sequelize.query(sqlInsert, {
          replacements: dt,
          type: sequelize.QueryTypes.INSERT,
          transaction: t
        });
        console.log(`${index}. Inserted`, res);
      });
    }).then(function (result) {
      console.log('Success: ')
    }).catch(function (err) {
      console.log('Error: ');
    });
  }
}