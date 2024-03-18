require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const tokenAuth = require("./middlewares/tokenauth");
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(process.env.PORT);
});
//middlewares
app.use(authRouter);
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

app.listen(process.PORT, () => console.log("Server is running on port 3000"));

module.exports = app;
