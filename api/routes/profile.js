const express = require("express");
const profileRouter = express.Router();
const connection = require("../db");

profileRouter.get("/api/profile", (req, res) => {
  const user = req.user;
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM UserProfileView WHERE \`email\` = '?'`, [user.email], (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).then((result) => {
    if (result.length == 0) res.status(404).send("No profile found for that user");
    else res.send(result[0]);
  });
});

module.exports = profileRouter;
