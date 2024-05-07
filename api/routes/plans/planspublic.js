require("dotenv").config();
const express = require("express");
const planspublicRouter = express.Router();
const connection = require("../../db");
const jwt = require("jsonwebtoken");

planspublicRouter.get("/api/destinations", async (req, res) => {
  try {
    let results = await connection.query(`SELECT * FROM Destinations ORDER BY DestinationID ASC`);
    result = results[0];
    res.send(result);
  } catch (e) {
    res.status(404).send(e);
  }
});

planspublicRouter.get("/api/userplans/details", async (req, res) => {
  const { planID } = req.query;
  let status = 0;
  //If user is authorized to be owner we send a status of 1 else we send 0
  //in order to display the save, add and delete buttons
  const token = req.header("x-auth-token");
  try {
    if (token !== null && token !== "null") {
      const verified = jwt.verify(token, process.env.jwtsecret);
      if (verified) {
        let results = await connection.query(`SELECT * FROM TravelPlan WHERE \`PlanID\` = ? AND \`UserID\` = ?`, [planID, verified.user.id]);
        if (results[0].length > 0) {
          status = 1;
        }
      }
    }
  } catch (e) {}
  try {
    let results = await connection.query(`SELECT * FROM PlanDetails WHERE \`PlanID\` = ? ORDER BY Date ASC`, [planID]);
    result = results[0];
    res.send({ result, status });
  } catch (e) {
    res.status(404).send(e);
  }
});
module.exports = planspublicRouter;
