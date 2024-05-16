require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const authRouter = require("./routes/auth");
const browserRouter = require("./routes/browser");
const placeRouter = require("./routes/place");
const tokenAuth = require("./middlewares/tokenauth");
const { profileRouter, profileRouterprivate } = require("./routes/profile");
const plansprivateRouter = require("./routes/plans/plansprivate");
const planspublicRouter = require("./routes/plans/planspublic");
const { reviewRouter, readReviewRouter } = require("./routes/review");
const { postsPublicRouter, postsPrivateRouter } = require("./routes/posts");
const app = express();
var cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
//
//http://localhost:3000/api/
app.get("/", (req, res) => {
  res.send(process.env.PORT || 8000);
});
//Public Routers
app.use(authRouter);
app.use(browserRouter);
app.use(placeRouter);
app.use(planspublicRouter);
app.use(profileRouter);
app.use(readReviewRouter);
app.use(postsPublicRouter);
//middlewares
app.use(tokenAuth);

app.get("/api/verify", (req, res) => {
  res.send("Verified!");
});

//Routers
app.use(plansprivateRouter);
app.use(profileRouterprivate);
app.use(postsPrivateRouter);
app.use(reviewRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT || 8000}`)
);
//Websockets THAT DONT WORK ON VERCEL
// const io = require("socket.io")(server, {
//   path: "/api/socket.io",
//   cors: {
//     origin: "*",
//   },
// });
// require("./socket/socket")(io);
