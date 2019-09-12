import Validator from 'validatorjs';

class CreateRequest {
  /**
   * Creates an instance of RegisterLotteryRequest.
   *
   * @param {Object} data
   * @memberof CreateRequest
   */
  constructor(data) {
    this.data = data;
    const validation = new Validator(this.data, this.getRules());
  }

  /**
   * Function make rules for request
   *
   * @returns {Object}
   * @memberof CreateRequest
   */
  getRules() {
    return {
      name: 'required',
      email: 'required',
      phone: 'required'
    }
  }

  /**
   * Check validate for request
   *
   * @return {Promise<boolean>}
   */
  isValid() {
    try {
      if (validation.fails()) {
        this.errors = validation.errors;
        return false;
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export { CreateRequest }