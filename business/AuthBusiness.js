import {sequelize} from '../models';
import {File} from "../helpers/File";

const SQL_GET_USER_BY_NAME = 'SQL009.sql';
const SQL_GET_USER_BY_ID = 'SQL010.sql';

export default class AuthBusiness {
  /**
   * Constructor
   */
  constructor() {
    this.fileHelper = new File();
  }

  /**
   * Get user by id
   *
   * @param {String} user_id
   * @returns {Array}
   */
  async getUserById(user_id) {
    const sql = await this.fileHelper.loadSql(SQL_GET_USER_BY_ID);
    const users = await sequelize.query(sql, {
      replacements: {
        user_id: user_id
      },
      type: sequelize.QueryTypes.SELECT
    });
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }

  /**
   * Get user by name
   *
   * @param {String} name
   * @returns {Array}
   */
  async getUserByName(name) {
    const sql = await this.fileHelper.loadSql(SQL_GET_USER_BY_NAME);
    const users = await sequelize.query(sql, {
      replacements: {
        name: name
      },
      type: sequelize.QueryTypes.SELECT
    });
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }
}