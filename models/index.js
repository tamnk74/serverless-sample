'use strict';

var LambdaEnvVars = require('lambda-env-vars');
var lambdaEnvVars = new LambdaEnvVars.default();

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = lambdaEnvVars.getDefaultDecryptedValue('NODE_ENV') || 'development';
const config = require('../config/db-config.json')[env];
const db = {};

console.log('ENV: ', env);
let sequelize = new Sequelize(config.database, config.username, config.password, config);

try {
  fs
    .readdirSync(path.resolve('./models'))
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      console.log('Loading model: ', file);
      const model = sequelize.import(path.join(path.resolve('./models'), file));
      db[model.name] = model;
      console.log('Loaded model: ', model.name);
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

catch (e) {
  console.log(e);
}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
