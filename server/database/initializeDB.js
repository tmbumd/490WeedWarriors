import Sequelize from 'sequelize';
// const sequelize = require('sequelize')
// import wkx from 'wkx';

// const wkx = require('wkx')
// Sequelize.GEOMETRY.prototype._stringify = function _stringify(value, options) {
//   return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOMETRY.prototype._bindParam = function _bindParam(value, options) {
//   return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOGRAPHY.prototype._stringify = function _stringify(value, options) {
//   return `ST_GeomFromText(${options.escape(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }
// Sequelize.GEOGRAPHY.prototype._bindParam = function _bindParam(value, options) {
//   return `ST_GeomFromText(${options.bindParam(wkx.Geometry.parseGeoJSON(value).toWkt())})`;
// }

// const Sequelize = new Sequelize()

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