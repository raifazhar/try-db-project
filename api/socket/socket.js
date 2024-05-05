const jwt = require("jsonwebtoken");
const connection = require("../db");

// socket.js
let users = [];

module.exports = function (io) {
  io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if (token == null || token == "null") return next(new Error("No authentication token, access denied"));
    const verified = jwt.verify(token, process.env.jwtsecret);
    if (!verified) return next(new Error("Token verification failed, authorization denied"));
    socket.user = verified.user;
    return next();
  });

  io.on("connection", async (socket) => {
    let user = socket.user;
    let userID = user.id;
    //once a user connects get all users and send them to that user
    if (!users[userID]) users[userID] = [];
    users[userID].push(socket.id);

    //get all users from database and send it to the connected socket once
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM User`, (err, result, fields) => {
        if (err) reject(err);
        else resolve(result);
      });
    }).then((result) => {
      result = result.filter((user) => user.UserID !== userID);
      io.to(socket.id).emit("all users", result);
    });

    socket.on("send message", async (msgobj) => {
      users[userID].forEach((socketID) => {
        io.to(socketID).emit("recieve message", msgobj);
      });
      if (users[msgobj.to]) {
        users[msgobj.to].forEach((socketID) => {
          io.to(socketID).emit("recieve message", msgobj);
        });
      }
    });

    socket.on("disconnect", () => {
      users[userID] = users[userID].filter((id) => id !== socket.id);
      if (users[userID].length === 0) delete users[userID];
      socket.disconnect();
    });
  });
};
