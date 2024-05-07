const express = require("express");
const profileRouter = express.Router();
const connection = require("../db");

profileRouter.get("/api/profile", async (req, res) => {
  const user = req.user;
  try {
    let results = await connection.query(`SELECT * FROM UserProfileView WHERE \`email\` = ?`, [user.email]);
    result = results[0];
    if (result.length == 0) res.status(404).send("No profile found for that user");
    else res.send(result[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = profileRouter;
