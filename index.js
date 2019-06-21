const cool = require('cool-ascii-faces')
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/home/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => res.send(showTimes()))
  .get('/postal_rate', handle_postal_rate)
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
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




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
  const weight = Number(request.query.weight);

  computeOperation(response, mail_type, weight)
}

function computeOperation(response, mail_type, weight) {

let result = 3.14;
console.log(mail_type);
  if (mail_type == 'Letters (Stamped)') {

  }
  else if (mail_type == 'Letters (Metered)') {

  }
  else if (mail_type == 'Large Envelopes (Flats)') {

  }
  else if (mail_type == 'First-Class Package Service-Retail') {
    if (weight > 15) {
      result = 4.94;
    }
  }

  const params = {result: result};
  response.render('pages/calc_result', params);

}
