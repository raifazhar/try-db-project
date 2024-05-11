const express = require("express");
const PlaceRouter = express.Router();
const connection = require("../db");

PlaceRouter.get("/api/placepage", async (req, res) => {
  let sqlQuery = "select * from Destinations where PlaceID = ?";
  const placeid = req.query.pageid;
  try {
    let results = await connection.query(sqlQuery, [placeid]);
    res.send(results[0]);
  } catch (e) {
    res.status(404).send(e);
    return;
  }
});

module.exports = PlaceRouter;
