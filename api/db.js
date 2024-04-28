require("dotenv").config();
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbdatabase,
  port: process.env.PORT,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the remote database!");
});

module.exports = connection;
