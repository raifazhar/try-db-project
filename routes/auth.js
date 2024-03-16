const express = require("express");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const connection = require("../db");
authRouter.post("/api/signUp", (req, res) => {
  const { username, password, email, usertype } = req.body;
  if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
    res.status(400).send({ status: "failed", element: "email", message: "Invalid email!" });
  } else if (password.length < 6) {
    res.status(400).send({ status: "failed", element: "password", message: "Password must be at least 6 characters long!" });
  } else if (email.trim() == "") {
    res.status(400).send({ status: "failed", element: "email", message: "Email must not be empty!" });
  } else if (username.trim() == "") {
    res.status(400).send({ status: "failed", element: "username", message: "Username must not be empty!" });
  } else if (usertype != 1 && usertype != 2) {
    res.status(400).send({ status: "failed", element: "usertype", message: "Wrong usertype!" });
  } else {
    var query = `SELECT * FROM \`User\` WHERE \`email\` = '${email}'`;
    let qresult;
    new Promise((resolve, reject) => {
      connection.query(query, (err, result, fields) => {
        if (err) reject(err);
        else resolve(result);
      });
    })
      .then((result) => {
        if (result.length > 0) {
          res.status(400).send({ status: "failed", element: "user", message: "User already exists!" });
          throw new Error("User already exists!");
        }
      })
      .then(() => {
        let hashedPassword = bcryptjs.hashSync(password, 10);
        query = `INSERT INTO \`User\`(\`name\`, \`email\`, \`password\`, \`type\`) VALUES ('${username}','${email}','${hashedPassword}',${usertype})`;
        try {
          connection.query(query);
          res.send({ status: "success", element: "user", message: "Account Created!" });
          console.log(`Account Created! with email: ${email}`);
        } catch (e) {
          console.log(e);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
});

authRouter.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  var query = `SELECT * FROM \`User\` WHERE \`email\` = '${email}'`;
  new Promise((resolve, reject) => {
    connection.query(query, (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  }).then((result) => {
    if (result.length == 0) {
      res.status(400).send({ status: "failed", element: "email", message: "User not found!" });
    } else {
      if (bcryptjs.compareSync(password, result[0].password)) {
        let user = {
          email: result[0].email,
          username: result[0].name,
          type: result[0].type,
        };
        const jtoken = jwt.sign({ user }, "thisisthesecretkey", { expiresIn: "1d" });
        res.send({ status: "success", token: jtoken, user: user });
      } else {
        res.status(400).send({ status: "failed", element: "password", message: "Invalid Password!" });
      }
    }
  });
});

module.exports = authRouter;
