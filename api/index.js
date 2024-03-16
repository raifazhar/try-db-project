require("dotenv").config();
const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const tokenAuth = require("./middlewares/tokenauth");
var cors = require("cors");
app.use(express.json());
app.use(cors());

app.get("/test", (req, res) => {
  res.send("Express on Vercel");
});

app.use(authRouter);
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});
app.listen(process.PORT, () => console.log("Server is running on port 3000"));

module.exports = app;
