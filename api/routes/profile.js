const express = require("express");
const profileRouter = express.Router();
const connection = require("../db");

profileRouter.get("/api/profile", (req, res) => {
  const user = req.user;
  var query = `SELECT * FROM \`UserProfileView\` WHERE \`email\` = '${user.email}'`;
  new Promise((resolve, reject) => {
    connection.query(query, (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).then((result) => {
    if (result.length == 0) res.status(404).send("No user found");
    else res.send(result[0]);
  });
});

module.exports = profileRouter;
