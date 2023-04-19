import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initializeDB.js';
const router = express.Router();

router.route('/').get((req, res) => {
  res.send('Welcome to the Weed Warriors API!');
});

router.route('/catalog')
  .get(async (req, res) => { 
    try {
      const catalog = await db.Catalog.findAll();
      const result = catalog.length > 0 ? { data: catalog } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json('Server error');
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