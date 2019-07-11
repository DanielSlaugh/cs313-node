const express = require("express");
const path = require("path");

var session = require("express-session");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session(
     { secret: "iloveuit" }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/fakebook", (req, res) => {
    res.render("home");
  })
  .post("/login", (req, res) => {
    var uname = req.body.username;
    var psw = req.body.password;

   if (uname == "admin" && psw == "password") {
      req.session.uname = req.body.username;
      req.session.psw = req.body.password;
      console.log("User Logged in!!");
      res.json({success: true});
   }
   else{
      console.log("U Suck!!");
      res.json({ success: false});
   }
  })
  .post("/logout", (req, res) => {
     var uname = req.session.uname;
     var psw = req.session.psw;

     if (uname == "admin" && psw == "password") {
       req.session.destroy();
       console.log("Logged out");
       res.json({ success: true });
     } else {
       console.log("Nothing to logout");
       res.json({ success: false });
     }
  })
  .get("/getServerTime", (req, res) => {
        var uname = req.session.uname;
        var psw = req.session.psw;
        console.log(uname);
        console.log(psw)
      if (uname == "admin" && psw == "password") {
         var time = new Date();
         var result = {success: true, time: time};
         res.json(result);
      }else{
         res.status(401).send()
      }
  }, verifyLogin)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


  function verifyLogin(req, res, next){
      if (req.session.uname) {
         next();
      }
      else{
         var result = {success: false, message: "Access denied"}
         res.status(401).json(result)
      }
  }