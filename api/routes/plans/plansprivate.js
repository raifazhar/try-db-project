const express = require("express");
const plansprivateRouter = express.Router();
const connection = require("../../db");
const e = require("express");

plansprivateRouter.get("/api/userplans", async (req, res) => {
  const id = req.user.id;
  try {
    let results = await connection.query(`SELECT * FROM TravelPlan WHERE \`UserID\` = ?`, [id]);
    result = results[0];
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
});
plansprivateRouter.post("/api/userplans", async (req, res) => {
  const id = req.user.id;
  let { title, description, date } = req.body;
  date = new Date(date);
  const dateString = date.toISOString().split("T")[0];
  if (!title || !description || !dateString) {
    return res.status(400).json({ msg: "Please enter all fields" });
  } else if (date < Date.now()) {
    return res.status(400).json({ msg: "Please enter a valid date" });
  } else if (Object.prototype.toString.call(date) !== "[object Date]") {
    return res.status(400).json({ msg: "Please enter a valid date" });
  }
  try {
    let results = await connection.query(`INSERT INTO TravelPlan (UserID,Description,Date,Title) VALUES (?,?,?,?)`, [id, description, date, title]);
    result = results[0];
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

plansprivateRouter.post("/api/userplans/details", async (req, res) => {
  const id = req.user.id;
  const { planID, details } = req.body;
  try {
    //Check if planID belongs to user
    let results = await connection.query(`SELECT * FROM TravelPlan WHERE \`UserID\` = ? AND \`PlanID\` = ?`, [id, planID]);
    result = results[0];
    if (result.length === 0) return res.status(401).send("Unauthorized");
    //Delete all previous details from the database
    results = await connection.query(`DELETE FROM PlanDetails WHERE \`PlanID\` = ?`, [planID]);
    result = results[0];
    //Insert all details into the database
    let InsertString = `INSERT INTO PlanDetails (PlanID,DestinationID,Date) VALUES `;
    details.array.forEach((element) => {
      console.log(element);
    });
    res.send("success");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = plansprivateRouter;
