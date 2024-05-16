const express = require("express");
const connection = require("../db");
const postsPublicRouter = express.Router();
const postsPrivateRouter = express.Router();

postsPublicRouter.get("/api/posts", async (req, res) => {
  try {
    let results = await connection.query(`SELECT * FROM Posts`);
    let posts = results[0];
    res.send(posts);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

postsPrivateRouter.post("/api/posts", async (req, res) => {
  const { title, content } = req.body;
  const userID = req.user.id;
  let sqlQuery = `call AddPost(?,?,?)`;
  try {
    let results = await connection.query(sqlQuery, [userID, title, content]);
    let result = results[0];
    res.send({ message: "Post created!" });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

module.exports = { postsPublicRouter, postsPrivateRouter };
