import DBConfig from '../config/db-config.json';
import config from '../config/common.json';
import LambdaEnvVars from "lambda-env-vars";
const lambdaEnvVars = new LambdaEnvVars();

const env = lambdaEnvVars.getDefaultDecryptedValue("NODE_ENV");

module.exports = {
  env,
  dbConfig: DBConfig[env],
  sqlPath: config[env].sqlPath,
};