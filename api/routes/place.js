const express = require("express");
const PlaceRouter = express.Router();
const connection = require("../db");

PlaceRouter.get("/api/placepage",(req,res)=>
    {
        let sqlQuery="call Getpagedata(?)"
        const pageid=req.query.pageid
        console.log(pageid)
        new Promise((resolve, reject) => {
            connection.query(sqlQuery,[pageid] ,(err, result, fields) => {
                if (err) reject(err);
                else resolve(result);
              });
        }).then((result) => {
            console.log(result[0])
            res.send(result[0]);
        }).catch((e)=>{
            res.status(404).send(e);
            return;
        });
        
    }

)

module.exports = PlaceRouter;