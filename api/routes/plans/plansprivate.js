const express = require("express");
const plansprivateRouter = express.Router();
const connection = require("../../db");

plansprivateRouter.get("/api/userplans", async (req, res) => {
  const id = req.user.id;
  try {
    let results = await connection.query(`call getUserPlans(?)`, [id]);
    result = results[0];
    res.send(result[0]);
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
plansprivateRouter.delete("/api/userplans", async (req, res) => {
  const id = req.user.id;
  let { planID } = req.body;
  try {
    let results = await connection.query(`call deletePlan(?,?)`, [id, planID]);
    let result = results[0][0][0];
    if (result.status === 0) {
      return res.status(401).send(result);
    } else {
      return res.send(result);
    }
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
    if (details.length === 0) return res.send({ msg: "Details Updated" });
    let InsertString = `INSERT INTO PlanDetails (PlanID,DestinationID,Date) VALUES ?`;
    let values = details.map((element) => {
      let date = new Date(element.date);
      date = date.toISOString().split("T")[0];
      return [planID, element.destinationID, date];
    });
    results = await connection.query(InsertString, [values]);
    result = results[0];
    res.send(result[0]);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = plansprivateRouter;
