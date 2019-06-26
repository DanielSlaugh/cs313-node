const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
   connectionString: process.env.DATABASE_URL});

express()
   .use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .get('/getperson', getPerson)
   .get('/', (req, res) => res.render('pages/home/index'))
   .get('/db', async (req, res) => {
      try {
         const client = await pool.connect()
         const result = await client.query('SELECT * FROM test_table');
         const results = { 'results': (result) ? result.rows : null };
         res.render('pages/db', results);
         client.release();
      } catch (err) {
         console.error(err);
         res.send("Error " + err);
      }
   })
   .listen(PORT, () => console.log(`Listening on ${PORT}`))


   function getPerson(req, res) {
      console.log("in Get Person");
      var id = req.params.id;

      getPersonFromDb(id, function(error, result) {
         console.log("Back from the database with the result: ", result)

         if (error || result == null || result.length != 1) {
            res.status(500).json({success: false, data: error});
         }else{
            res.json(result[0]);
         }
      });
   }

   function getPersonFromDb(id, callback) {
      console.log("Getting person from DB: ID = ", id);

      var sql = "SELECT id, first_name, last_name, brith_date FROM person WHERE id = $1::int";
      var params = [id];

      pool.query(sql, params, function(err, result){
         if (err){
            console.log("An error occured with the database");
            console.log(err);
            callback(err, null);
         }
         console.log("found DB Result: ", JSON.stringify(result))
      })
   }

