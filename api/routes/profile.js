require("dotenv").config();
const express = require("express");
const profileRouter = express.Router();
const profileRouterprivate = express.Router();
const connection = require("../db");
const jwt = require("jsonwebtoken");

profileRouter.get("/api/profile", async (req, res) => {
  const token = req.header("x-auth-token");
  const id = parseInt(req.query.id);
  let userid = null;
  try {
    if (token !== null && token !== "null") {
      const verified = jwt.verify(token, process.env.jwtsecret);
      if (verified) {
        userid = verified.user.id;
      }
    }
  } catch (e) {}
  try {
    let results = await connection.query(
      `SELECT * FROM UserProfileView WHERE \`UserID\` = ?`,
      [id]
    );
    let result = results[0];
    if (result.length == 0)
      res.status(404).send("No profile found for that user");
    else {
      if (id == userid) result[0].isOwner = true;
      else result[0].isOwner = false;
      res.send(result[0]);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

profileRouterprivate.post("/api/profile", async (req, res) => {
  const user = req.user;
  const { name, bio, travelPrefs } = req.body;
  try {
    let results = await connection.query(`call updateProfile(?,?,?,?)`, [
      user.id,
      name,
      bio,
      travelPrefs,
    ]);
    let result = results[0][0];
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});
module.exports = { profileRouter, profileRouterprivate };
