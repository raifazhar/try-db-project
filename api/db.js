require("dotenv").config();
const mysql = require("mysql");
var connectionDetails = {
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbdatabase,
  port: process.env.dbport,
};

function handleDisconnect() {
  connection = mysql.createConnection(connectionDetails);

  connection.connect((err) => {
    if (err) {
      console.log("Error when connecting to database:", err);
      setTimeout(handleDisconnect, 60000); // try reconnecting after 1 minute
    } else {
      console.log("Connected to the remote database!");
    }
  });

  connection.on("error", (err) => {
    console.log("Database error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ER_USER_LIMIT_REACHED") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;
