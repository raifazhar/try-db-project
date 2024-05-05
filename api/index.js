require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const authRouter = require("./routes/auth");
const browserRouter = require("./routes/browser");
const placeRouter = require("./routes/place");
const tokenAuth = require("./middlewares/tokenauth");
const profileRouter = require("./routes/profile");
const app = express();
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());

//http://localhost:3000/api/
app.get("/", (req, res) => {
  res.send(process.env.PORT);
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

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
//Websockets THAT DONT WORK ON VERCEL
// const io = require("socket.io")(server, {
//   path: "/api/socket.io",
//   cors: {
//     origin: "*",
//   },
// });
// require("./socket/socket")(io);
