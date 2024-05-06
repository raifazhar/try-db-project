const express = require("express");
const planspublicRouter = express.Router();
const connection = require("../../db");

planspublicRouter.get("/api/destinations", (req, res) => {
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM Destinations`, (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  })
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      console.log(e);
      res.status(404).send(e);
    });
});

module.exports = planspublicRouter;
