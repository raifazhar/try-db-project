const express = require("express");
const mysql = require("mysql");
const PORT = 3000;
const app = express();

app.use(express.json());

const connection = mysql.createConnection({
  host: "sql6.freesqldatabase.com",
  user: "sql6691466",
  password: "9NhEcXl3Ha",
  database: "sql6691466",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the remote database!");
});
app.post("/createUser", (req, res) => {
  //let { username, password, email, usertype } = req.body;
  let username = "test";
  let password = "test";
  let email = "test";
  let usertype = 1;
  if (
    email.match(
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    ) == false
  ) {
    res.statusCode(400).send("Enter a correct email");
  }
  if (password.length < 6) {
    res.statusCode(400).send("Weak password!");
  }
  if (username.trim() == "" || email.trim() == "") {
    res.statusCode(400).send("Empty username or Email");
  }
  if (usertype != 1 && usertype != 2) {
    res.statusCode(400).send("Wrong user type!");
  }
  const query = `INSERT INTO 'User'('id','name','email','password','type') VALUES('${username}','${email}','${password}',${type});`;
  try {
    connection.query(query, (err, results) => {
      console.log("Data Posted:", results);
    });
    res.send(results);
  } catch (e) {
    console.log(e);
  }
});
app.get("/getUserLogin", (req, res) => {
  let data;
  const query = "SELECT * FROM User";
  try {
    connection.query(query, (err, results) => {
      console.log("Data fetched:", results);
      data = results;
    });
    res.send(data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
