const express = require("express");
const plansprivateRouter = express.Router();
const connection = require("../../db");

plansprivateRouter.get("/api/userplans", (req, res) => {
  const id = req.user.id;
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM TravelPlan WHERE \`UserID\` = ?`, [id], (err, result, fields) => {
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

plansprivateRouter.post("/api/userplans", (req, res) => {
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
  new Promise((resolve, reject) => {
    connection.query(`INSERT INTO TravelPlan (UserID,Description,Date,Title) VALUES (?,?,?,?)`, [id, description, date, title], (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  })
    .then((result) => {
      res.send(result);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});
module.exports = plansprivateRouter;
