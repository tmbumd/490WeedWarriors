import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initializeDB.js';
import { Storage } from '@google-cloud/storage';
import Multer from 'multer';

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // No larger than 5mb, change as you need
  },
});

let projectId = "INST490"; // Get this from Google Cloud
let keyFilename = "keys.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
const storage = new Storage({
  projectId,
  keyFilename,
});
const bucket = storage.bucket("weedwarriors"); // Get this from Google Cloud -> Storage
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
      res.json(err);
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
    try {
      await db.Reports.create({
        report_id: currentId,
        timestamp: req.body.timestamp,
        catalog_id: req.body.catalog_id,
        location: req.body.location,
        severity_id: req.body.severity_id,
        media_id: 1, //CREATE THIS
        comments: req.body.comments,
        person_id: 1, //FIND/CREATE THIS
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

router.route('/upload')
  .get(async (req, res) => {
    try {
      const [files] = await bucket.getFiles();
      res.send([files]);
      console.log("Success");
    } catch (error) {
      res.send("Error:" + error);
    }
  })
  .post(async (req, res) => {
    console.log("Made it /upload");
    try {
      if (req.file) {
        console.log("File found, trying to upload...");
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream();
        console.log(blob);
        blobStream.on("finish", () => {
          res.status(200).send("Success");
          console.log("Success");
        });
        blobStream.end(req.file.buffer);
      } else throw "error with img";
    } catch (error) {
      res.status(500).send(error);
    }
  });

export default router;