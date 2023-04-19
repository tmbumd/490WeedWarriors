import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;
import modelList from '../models/index.js';

const sequelizeDB = new Sequelize('weedwarriors', 'avnadmin', 'AVNS_wbNozRCRePIYO0Z4CO8', {
  host: 'subscription-surfer-nhaya.aivencloud.com',
  dialect: 'mysql',
  port: 16842
});

const db = Object.keys(modelList).reduce((collection, modelName) => {
    if (!collection[modelName]) {
      collection[modelName] = modelList[modelName](sequelizeDB, DataTypes);
    }
    return collection;
  }, {});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

db.sequelizeDB = sequelizeDB;
db.Sequelize = Sequelize;

export default db;