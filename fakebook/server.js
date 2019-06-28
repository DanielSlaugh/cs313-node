const express = require('express')
const path = require("path")
const PORT = process.env.PORT || 5000

const { Pool } = require("pg");
const pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: true });

express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set("view engine", "ejs")
.get("/fakebook", (req, res) => {
   var sql =
     "SELECT u.display_name, m.message_text, m.message_time FROM users u JOIN message m ON u.id = m.user_id ORDER BY m.message_time DESC";
   pool.query(sql, function (err, result){
      console.log(result)
      res.render("home")
      })
   })

   // app.get('/getPerson', getPerson);

.listen(PORT, () => console.log(`Fakebook server running on port ${PORT}`))


// function getPerson(request, response) {
//    const id = request.query.id;
//    getPersonFromDb(id, function (error, result) {
//       if (error || result == null || result.length != 1) {
//          response.status(500).json({ success: false, data: error });
//       } else {
//          const person = result[0];
//          response.status(200).json(person);
//       }
//    });
// }

// function getPersonFromDb(id, callback) {
//    console.log("Getting person from DB with id: " + id);

//    const sql = "SELECT id, first, last, birthdate FROM person WHERE id = $1::int";

//    const params = [id];
//    pool.query(sql, params, function (err, result) {
//       if (err) {
//          console.log("Error in query: ")
//          console.log(err);
//          callback(err, null);
//       }

//       console.log("Found result: " + JSON.stringify(result.rows));
//       callback(null, result.rows);
//    });
// }