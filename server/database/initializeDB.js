import Sequelize from 'sequelize';
const { DataTypes } = Sequelize;
import modelList from '../models/index.js';
import * as dotenv from 'dotenv';

dotenv.config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT
const DB_DIALECT = process.env.DB_DIALECT

const sequelizeDB = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  port: DB_PORT,
  logging: false
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