const express = require("express");
const connection = require("../db");
const reviewRouter = express.Router();
const readReviewRouter = express.Router();

reviewRouter.post("/api/review", async (req, res) => {
  const { rating, destinationID, DescriptionReview } = req.body;

  const userID = req.user.id;

  let sqlQuery = `call AddReview (?,?,?,?)`;

  try {
    let results = await connection.query(sqlQuery, [
      userID,
      destinationID,
      rating,
      DescriptionReview,
    ]);
    let result = results[0];

    res.send({ message: "Review posted!" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

readReviewRouter.get("/api/review", async (req, res) => {
  const destinationID = req.query.destinationID;

  let sqlQuery = `call getReviews(?)`;

  try {
    let results = await connection.query(sqlQuery, [destinationID]);
    let result = results[0][0];

    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = { reviewRouter, readReviewRouter };
