require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const tokenAuth = require("./middlewares/tokenauth");
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Express on Vercel");
});

app.use(authRouter);
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.PORT, () => console.log("Server is running on port 3000"));

module.exports = app;
