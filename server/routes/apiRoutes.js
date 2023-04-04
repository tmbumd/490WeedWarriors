import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initializeDB.js';
const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the API!');
});

router.route('/records')
  .get(async (req, res) => { // res, req, next
    try {
      const records = await db.Records.findAll();
      //   const reply = availability.length > 0 ? { data: availability } : { message: 'no results found' };
      res.json(records);
    } catch (err) {
      res.json('Server error');
    }
  });

router.route('/geo')
  .get(async (req, res) => {
    const x = `SELECT jsonb_build_object(
      'type',       'Feature',
      'id',         id,
      'geometry',   ST_AsGeoJSON(geom)::jsonb,
      'properties', to_jsonb(row) - 'id' - 'geom'
  ) FROM (SELECT * FROM input_table) row;
    `
    try {
      const result = await db.sequelizeDB.query(x, { type: sequelize.QueryTypes.SELECT });
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  });

router.route('/custom/:query')
  .get(async (req, res) => {
    try {
      const result = await db.sequelizeDB.query(req.params.query, { type: sequelize.QueryTypes.SELECT });
      res.json(result);
    } catch (err) {
      res.send(err);
    }
  });

export default router;