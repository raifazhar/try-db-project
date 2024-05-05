require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const authRouter = require("./routes/auth");
const browserRouter = require("./routes/browser");
const placeRouter = require("./routes/place");
const tokenAuth = require("./middlewares/tokenauth");
const profileRouter = require("./routes/profile");
const app = express();
const port = process.env.PORT || 3000;
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

//http://localhost:3000/api/
app.get("/", (req, res) => {
  res.send(port);
});
app.use(authRouter);
app.use(browserRouter);
app.use(placeRouter);
//middlewares
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

//Routers
app.use(profileRouter);

const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
const io = require("socket.io")(server, {
  path: "/api/socket.io",
  cors: {
    origin: "*",
  },
});
require("./socket/socket")(io);
