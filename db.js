const express = require("express");
const mysql = require("mysql");
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

module.exports = connection;
