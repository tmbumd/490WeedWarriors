import express from "express";
import sequelize from "sequelize";
import db from "../database/initializeDB.js";

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Welcome to the Weed Warriors API!");
});

router.route("/catalog").get(async (req, res) => {
  try {
    const catalog = await db.sequelizeDB.query(
      "SELECT * FROM catalog ORDER BY common_name",
      { type: sequelize.QueryTypes.SELECT }
    );
    const result =
      catalog.length > 0
        ? { data: catalog }
        : { message: "No results found" };
    res.json(result);
  } catch (err) {
    res.send(err);
  }
});

router.route("/severity").get(async (req, res) => {
  try {
    const severity = await db.Severity.findAll();
    const result =
      severity.length > 0
        ? { data: severity }
        : { message: "No results found" };
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

router
  .route("/media")
  .get(async (req, res) => {
    const media = await db.Media.findAll();
    const result =
      media.length > 0 ? { data: media } : { message: "No results found" };
    res.json(result);
  })
  .post(async (req, res) => {
    try {
      await db.Media.create({
        media_id: req.body.media_id,
        url: req.body.url,
      });
      res.send({ message: "Media added" });
    } catch (err) {
      res.send(err);
    }
  });

router
  .route("/users")
  .get(async (req, res) => {
    try {
      const users = await db.Users.findAll();
      const result =
        users.length > 0 ? { data: users } : { message: "No results found" };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    try {
      await db.Users.create({
        user_id: req.body.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
      })
      res.send({ message: "User added" })
    } catch (err) {
      res.json(err)
    }
  });

router
  .route("/reports")
  .get(async (req, res) => {
    try {
      const reports = await db.Reports.findAll();
      const result =
        reports.length > 0
          ? { data: reports }
          : { message: "No results found" };
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  })
  .post(async (req, res) => {
    const reports = await db.Reports.findAll();
    const currentId = reports.length > 0 ? reports[0].length + 1 : 1;
    try {
      await db.Reports.create({
        report_id: currentId,
        timestamp: req.body.timestamp,
        catalog_id: req.body.catalog_id,
        location: req.body.location,
        severity_id: req.body.severity_id,
        media_id: req.body.media_id,
        comments: req.body.comments,
        user_id: req.body.user_id,
        verified: 0,
      });
      res.send({ message: "Report added" });
    } catch (err) {
      res.send(err);
    }
  });

router.route("/custom/:query").get(async (req, res) => {
  try {
    const result = await db.sequelizeDB.query(req.params.query, {
      type: sequelize.QueryTypes.SELECT,
    });
    res.json(result);
  } catch (err) {
    res.send(err);
  }
});

export default router;
