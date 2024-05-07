const express = require("express");
const bcryptjs = require("bcryptjs");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const connection = require("../db");

authRouter.post("/api/signUp", async (req, res) => {
  const { username, password, email, usertype } = req.body;
  if (!email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
    res.status(401).send({ element: "email", message: "Invalid email!" });
  } else if (password.length < 6) {
    res.status(401).send({ element: "password", message: "Password must be at least 6 characters long!" });
  } else if (email.trim() == "") {
    res.status(401).send({ element: "email", message: "Email must not be empty!" });
  } else if (username.trim() == "") {
    res.status(401).send({ element: "username", message: "Username must not be empty!" });
  } else if (password.trim() == "") {
    res.status(401).send({ element: "password", message: "Password must not be empty!" });
  } else if (usertype != 1 && usertype != 2) {
    res.status(401).send({ element: "usertype", message: "Wrong usertype!" });
  } else {
    try {
      let results = await connection.query(`SELECT * FROM \`User\` WHERE \`email\` = ?`, [email]);
      result = results[0];
      if (result.length > 0) {
        res.status(401).send({ element: "user", message: "User already exists!" });
      }
      let hashedPassword = bcryptjs.hashSync(password, 10);
      results = await connection.query(`INSERT INTO \`User\`(\`name\`, \`email\`, \`password\`, \`type\`) VALUES (?,?,?,?)`, [username, email, hashedPassword, parseInt(usertype)]);
      result = results[0];
      res.send({ element: "user", message: "Account Created!" });
      console.log(`Account Created! with email: ${email}`);
    } catch (e) {
      console.log(e);
      res.status(500).send({ element: "user", message: "Error creating account!" });
    }
  }
});

authRouter.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let results = await connection.query(`SELECT * FROM \`User\` WHERE \`email\` = ?`, [email]);
    let result = results[0];
    if (result.length == 0) {
      res.status(401).send({ element: "email", message: "User not found!" });
    } else {
      if (bcryptjs.compareSync(password, result[0].password)) {
        let user = {
          id: result[0].UserID,
          email: result[0].email,
          username: result[0].name,
          type: result[0].type,
        };
        const jtoken = jwt.sign({ user }, process.env.jwtsecret, { expiresIn: "1d" });
        res.send({ token: jtoken, user: user });
      } else {
        res.status(401).send({ element: "password", message: "Invalid Password!" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ element: "user", message: "Error logging in!" });
  }
});

module.exports = authRouter;
