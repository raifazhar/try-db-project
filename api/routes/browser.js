const express = require("express");
const browserRouter = express.Router();
const connection = require("../db");

browserRouter.get("/api/browser", (req, res) => {
    var query=`Select * from \`browserdata\``;
    new Promise((resolve, reject) => {
        connection.query(query, (err, result, fields) => {
          if (err) reject(err);
          else resolve(result);
        });
      }).then((result) => {
        res.send(result);
      }).catch((e)=>{
        res.status(404).send(e);
        return;
      });

})

module.exports = browserRouter;