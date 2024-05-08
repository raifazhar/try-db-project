const express = require("express");
const PlaceRouter = express.Router();
const connection = require("../db");

PlaceRouter.get("/api/placepage", async (req, res) => {
  let sqlQuery = "call Getpagedata(?)";
  const pageid = req.query.pageid;
  try {
    let results = await connection.query(sqlQuery, [pageid]);
    let result = results[0];
    const newresponse = {
      pageid: result[0][0].pageID,
      description: result[0][0].description,
    };

    // Iterate through the remaining elements
    for (let i = 0; i < result[0].length; i++) {
      const element = result[0][i];
      newresponse[element.pictureID] = element.url;
    }
    res.send(newresponse);
  } catch (e) {
    res.status(404).send(e);
    return;
  }
});

module.exports = PlaceRouter;
