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
    res.status(401).send({ element: "password", message: "Password must be atleast 6 characters long!" });
  } else {
    try {
      let hashedPassword = bcryptjs.hashSync(password, 10);
      let results = await connection.query(`call signUpUser(?,?,?,?)`, [username, email, hashedPassword, parseInt(usertype)]);
      let result = results[0][0][0];
      console.log(result.status);
      if (result.status === 0) {
        return res.status(401).send(result);
      } else {
        return res.send(result);
      }
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
        const jtoken = jwt.sign({ user }, process.env.jwtsecret, {
          expiresIn: "1d",
        });
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
