import {authBusiness} from '../business';
import jwt from "jsonwebtoken";
import policy from "./IAMPolicy";

/**
 * Check valid user
 */
const authenUser = async data => {
  const user = await authBusiness.getUserById(data.user_id);
  return user ? true : false;
};

/**
 * Authorizer functions are executed before your actual functions.
 * @method authorize
 * @param {String} event.authorizationToken - JWT
 * @throws Returns 401 if the token is invalid or has expired.
 * @throws Returns 403 if the token does not have sufficient permissions.
 * @return { Object } IAMPolicy
 */
const handler = async (event, context, callback) => {
  try {
    let token = event.authorizationToken;
    console.log('Token:', token);
    if (!token) {
      throw new Error('Unauthorized');
    }
    const publicKey = fs.readFileSync(path.resolve('config', 'cert', 'public.key'), 'utf8');
    const verifyOptions = {
      issuer: 'Serverless',
      subject: 'admin@gmail.com',
      audience: 'https://gledi2t6xb.execute-api.ap-northeast-1.amazonaws.com',
      expiresIn: "12h",
      algorithm: "RS256"
    };
    const decodeToken = jwt.verify(token, publicKey, verifyOptions);

    let isAllowed = await authenUser(decodeToken);
    let effect = isAllowed ? "Allow" : "Deny";
    let user = decodeToken ? decodeToken : "";
    let userId = decodeToken.user_id ? decodeToken.user_id : "";
    let authorizerContext = {user: JSON.stringify(user)};
    let policyDocument = policy.buildIAMPolicy(
      userId,
      effect,
      event.methodArn,
      authorizerContext
    );

    return policyDocument;
  } catch (e) {
    console.log(e);
    let effect = "Deny";
    let userId = "Not Authorizer";
    let authorizerContext = {user: JSON.stringify("")};
    let policyDocument = policy.buildIAMPolicy(
      userId,
      effect,
      event.methodArn,
      authorizerContext
    );

    return policyDocument;
  }
};

export {handler};
