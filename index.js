const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')

var session = require('express-session')
var bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

// All the magic happens here
express()
  .use(express.static(path.join(__dirname, "public")))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({secret: 'iloveuit'}))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/", (req, res) => res.render("pages/home/index"))
  .get("/cool", (req, res) => res.send(cool()))
  .get("/times", (req, res) => res.send(showTimes()))
  .get("/postal_rate", handle_postal_rate)
  .get("/db", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT * FROM test_table");
      const results = { results: result ? result.rows : null };
      res.render("pages/db", results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get("/fakebook", (req, res) => {
      res.render("home");

    })
  .post("/user", (req, res) =>{
      var sql = "SELECT u.id, u.username, u.password, u.display_name, m.message_text, m.message_time, m.id FROM users u JOIN message m ON u.id = m.user_id ORDER BY m.message_time DESC";
      pool.query(sql, function(err, result) {
      res.json({result: result, val: req.session.val || 0});
      })
  })
  .post("/getCommentFeed", (req, res) => {
    var sql = "SELECT m.message_text, m.message_time, m.id, c.comment_text, c.user_id FROM comment c JOIN message m ON c.message_id = m.id ORDER BY m.message_time DESC";
    // var sql = "SELECT m.message_text, m.message_time, m.id, c.comment_text FROM comment c JOIN message m ON c.message_id = m.id WHERE m.id='4' ORDER BY m.message_time DESC";
    pool.query(sql, function (err, result) {
      res.json({ result: result, val: req.session.val || 0 });
    })
  })
  .post("/getUserList", (req, res) => {
    var current_id = req.body.current_user_id
    var sql = "SELECT * FROM users WHERE id='" + current_id + "'";
    pool.query(sql, function (err, result) {
      res.json({ result: result});
    })
  })
  .post("/getCurrentUser", (req, res) => {
    var current_display_name = req.session.current_display_name
    res.json({current_display_name: current_display_name || "Guest"});

  })
  .post("/set_message_id", (req, res) => {
    req.session.message_id = req.body.message_id
    var message_id = req.session.message_id
    res.json({ message_id: message_id});

  })
  .post("/login", (req, res) => {
      var uname = req.body.uname
      var psw = req.body.psw
      var sql = "SELECT u.id, u.display_name, u.username, u.password FROM users u WHERE u.username='" + uname + "' AND u.password='" + psw + "'";
      pool.query(sql, function (err, result) {
         var length = result.rows.length
         if (length == 0) {
           req.session.val = 0;
           res.json({val: 0})
          }
          else{
           req.session.current_display_name = result.rows[0].display_name;
           req.session.current_id = result.rows[0].id;
           var current_display_name = req.session.current_display_name;
           req.session.val = 1;
           res.json({ val: 1, current_display_name: current_display_name})
         }
      })
  })
  .post("/sign_up", (req, res) => {
    var uname = req.body.uname
    var psw = req.body.psw
    var dname = req.body.dname
    var sql = "INSERT INTO users (username, password, display_name) VALUES ('" + uname + "', '" + psw + "', '" + dname + "')";
    req.session.destroy();
    pool.query(sql, function (err, result) {
        res.json({ val: 1})
    })
  })
  .post("/new_message", (req, res) => {
    var new_message = req.body.message_text
    console.log(new_message)
    var sql = "INSERT INTO message (user_id, message_text) VALUES ('" + req.session.current_id + "', '" + new_message + "')";
    pool.query(sql, function (err, result) {
       res.json({new_message: new_message})
    })
  })
  .post("/new_comment", (req, res) => {
    var new_comment = req.body.comment_text
    console.log(new_comment)
    var sql = "INSERT INTO comment (message_id, comment_text, user_id) VALUES (" + req.session.message_id + ", '" + new_comment + "', '" + req.session.current_id + "')";
    pool.query(sql, function (err, result) {
      res.json({ new_comment: new_comment })
    })
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));





// OLD CODE FOR 313 ASSIGNMENTS
showTimes = () => {
  let result = ''
  const times = process.env.TIMES || 5
  for (i = 0; i < times; i++) {
    result += i + ' '
  }
  return result;
}

function handle_postal_rate(request, response) {
  const mail_type = request.query.mail_type;
  const weight = Number(request.query.Weight);

  computeOperation(response, mail_type, weight)
}

function computeOperation(response, mail_type, weight) {

let result = 3.14;
console.log(mail_type);
console.log(weight);
  if (mail_type == "Letters (Stamped)") {
    if (weight >= 3.5) { result = 1.00; }
    else if (weight >= 3) { result = 0.85; }
    else if (weight >= 2) { result = 0.70; }
    else { result = 0.55; }
  }
  else if (mail_type == "Letters (Metered)") {
    if (weight >= 3.5) { result = 0.95; }
    else if (weight >= 3) { result = 0.80; }
    else if (weight >= 2) { result = 0.65; }
    else { result = 0.50; }
  }
  else if (mail_type == "Large Envelopes (Flats)") {
    if (weight >= 13) { result = 2.80; }
    else if (weight >= 12) { result = 2.65; }
    else if (weight >= 11) { result = 2.50; }
    else if (weight >= 10) { result = 2.35; }
    else if (weight >= 9) { result = 2.20; }
    else if (weight >= 8) { result = 2.05; }
    else if (weight >= 7) { result = 1.90; }
    else if (weight >= 6) { result = 1.75; }
    else if (weight >= 5) { result = 1.60; }
    else if (weight >= 4) { result = 1.45; }
    else if (weight >= 3) { result = 1.30; }
    else if (weight >= 2) { result = 1.15; }
    else { result = 1.00; }
  }
  else if (mail_type == "First-Class Package Service-Retail") {
    console.log('In parsel')
    if (weight >= 13) {result = 4.94;}
    else if (weight >= 9) { result = 3.82; }
    else if (weight >= 5) { result = 3.18; }
    else { result = 2.66; }
  }

  const params = {result: result};
  response.render('pages/calc_result', params);

}
