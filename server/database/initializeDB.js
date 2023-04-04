import Sequelize from 'sequelize';

const { DataTypes } = Sequelize;
// import { Records } from '../models/Records.js'
import modelList from '../models/index.js';

const sequelizeDB = new Sequelize('weedwarriors', 'postgres', '7872', {
    host: 'localhost',
    dialect: 'postgres'
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