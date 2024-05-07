const express = require("express");
const browserRouter = express.Router();
const connection = require("../db");

browserRouter.get("/api/browser", async (req, res) => {
  let sqlQuery = "call getbrowserdata";
  try {
    let results = await connection.query(sqlQuery);
    result = results[0];
    res.send(result[0]);
  } catch (e) {
    res.status(404).send(e);
    return;
  }
});

browserRouter.get("/api/search", async (req, res) => {
  let sqlQuery = "call search(?)";
  const searchstring = req.query.searchstring;
  try {
    let results = await connection.query(sqlQuery, [searchstring]);
    result = results[0];
    res.send(result[0]);
  } catch (e) {
    return res.status(404).send(e);
  }
});
module.exports = browserRouter;
