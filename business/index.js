import AuthBusiness from './AuthBusiness';
import UserBusiness from './UserBusiness';

module.exports = {
  authBusiness: new AuthBusiness(),
  userBusiness: new UserBusiness(),
};