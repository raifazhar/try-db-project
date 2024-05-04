const express = require("express");
const browserRouter = express.Router();
const connection = require("../db");

browserRouter.get("/api/browser", (req, res) => {
    let sqlQuery='call getbrowserdata'
    new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, result, fields) => {
          if (err) reject(err);
          else resolve(result);
        });
      }).then((result) => {
        res.send(result[0]);
      }).catch((e)=>{
        res.status(404).send(e);
        return;
      });
})

browserRouter.get("/api/search", (req, res) => {  
  let sqlQuery='call search(?)'

  const searchstring=req.query.searchstring
  console.log(searchstring)
  new Promise((resolve, reject) => {
      connection.query(sqlQuery,[searchstring] ,(err, result, fields) => {
        if (err) reject(err);
        else resolve(result);
      });
    }).then((result) => {
      res.send(result[0]);
    }).catch((e)=>{
      res.status(404).send(e);
      return;
    });
})
module.exports = browserRouter;