require("dotenv").config();
const mysql = require("mysql2/promise");
var connectionDetails = {
  host: process.env.dbhost,
  user: process.env.dbuser,
  password: process.env.dbpassword,
  database: process.env.dbdatabase,
  port: process.env.dbport,
};

  });
const pool = mysql.createPool(connectionDetails);
async function handleDisconnect() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to remote database");
    connection.release();
  } catch (err) {
    console.log("Error connecting to database");
    setTimeout(handleDisconnect, 60000);
  }
}

pool.on("error", async (err) => {
  console.log("Database error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST" || err.code === "ER_USER_LIMIT_REACHED") handleDisconnect();
  else throw err;
});
handleDisconnect();

module.exports = pool;
