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
app.use(authRouter);

//middlewares
app.use(tokenAuth);
app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

//Routers
app.use(profileRouter);

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));

module.exports = app;
