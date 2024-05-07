const express = require("express");
const PlaceRouter = express.Router();
const connection = require("../db");

PlaceRouter.get("/api/placepage", async (req, res) => {
  let sqlQuery = "call Getpagedata(?)";
  const pageid = req.query.pageid;
  try {
    let results = await connection.query(sqlQuery, [pageid]);
    result = results[0];
    res.send(result[0]);
  } catch (e) {
    return res.status(404).send(e);
  }
});

module.exports = PlaceRouter;
