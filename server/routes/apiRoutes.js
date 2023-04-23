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
      const result = await db.sequelizeDB.query('SELECT * FROM catalog ORDER BY common_name', { type: sequelize.QueryTypes.SELECT });
      res.json({ data: result });
    } catch (err) {
      res.send(err);
    }
  });

router.route('/severity')
  .get(async (req, res) => {
    try {
      const severity = await db.Severity.findAll();
      const result = severity.length > 0 ? { data: severity } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  });
router.route('/catalog')
  .get(async (req,res) => {
    try{
    const catalog = await db.catalog.findAll();
    const result = severity.length > 0 ? { data: severity } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  });
router.route('/media')
  .get(async (req, res) => {
    const media = await db.media.findAll();
    const result = media.length > 0 ? { data: media } : { message: 'No results found' };
    res.json(result);
  })
  .post(async (req, res) => {
      try{
        await db.media.create({
          media_id: req.body.mediaID,
          url: req.body.url
        })
      }catch (err){
        res.send(err);
      }
  });

router.route('/users')
  .get(async (req, res) => {
    try {
      const users = await db.users.findAll();
      const result = users.length > 0 ? { data: users } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
      
  });

router.route('/reports')
  .get(async (req, res) => {
    try {
      const reports = await db.Reports.findAll();
      const result = reports.length > 0 ? { data: reports } : { message: 'No results found' };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    const reports = await db.Reports.findAll();
    const currentId = (await reports.length) + 1;
    const users =  await db.users.findAll();
    try {
      await db.Reports.create({
        report_id: currentId,
        timestamp: req.body.timestamp,
        catalog_id: req.body.catalog_id,
        location: req.body.location,
        severity_id: req.body.severity_id,
        media_id: req.body.media_id, 
        comments: req.body.comments,
        // there should be no condition where the user has not already been created - situation now handled in script
        user_id: users.find({where:{email :req.body.email }}).user_id, 
        verified: 0
      });
      res.send('Report added');
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