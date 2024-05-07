const express = require("express");
const planspublicRouter = express.Router();
const connection = require("../../db");

planspublicRouter.get("/api/destinations", async (req, res) => {
  try {
    let results = await connection.query(`SELECT * FROM Destinations`);
    result = results[0];
    res.send(result);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = planspublicRouter;
