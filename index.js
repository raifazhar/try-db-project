const express = require("express");
const PORT = 3000;
const app = express();
const authRouter = require("./routes/auth");
const tokenAuth = require("./middlewares/tokenauth");
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
