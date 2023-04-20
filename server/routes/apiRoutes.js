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

  router.route('/severity')
    .get(async (req, res) => {
      try {
        const severity = await db.Severity.findAll();
        const result = severity.length > 0 ? { data: severity } : { message: 'No results found' };
        res.json(result);
      } catch (err) {
        res.json('Server error');
      }
    });

router.route('/reports')
  .get(async (req, res) => {
    try {
      const reports = await db.Reports.findAll();
      const result = reports.length > 0 ? { data: reports } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json('Server error');
    }
  })
  .post(async (req, res) => {
    const reports = await db.Reports.findAll();
    const currentId = (await reports.length) + 1;
    try {
      await db.Reports.create({
        report_id: currentId,
        timestamp: req.timestamp,
        catalog_id: req.catalog_id,
        location: req.location, //CREATE THIS
        severity_id: req.severity_id,
        media_id: req.media_id, //CREATE THIS
        comments: req.comments,
        person_id: req.person_id, //FIND/CREATE THIS
        verified: 0
      });
      res.send('Successfully added');
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