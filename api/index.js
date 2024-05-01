require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const tokenAuth = require("./middlewares/tokenauth");
const profileRouter = require("./routes/profile");
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(process.env.PORT);
});
//middlewares
app.use(authRouter);
app.use(tokenAuth);

app.use(profileRouter);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

module.exports = app;
