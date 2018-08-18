const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .get('/times', (req, res) => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
        result += i + ' '
    }
    res.send(result)
  })
  .get('/db', async (req, res) => {
    try {
        client.connect();
        client.query('SELECT * FROM test_table;', (err, res) => {
          if (err) throw err;
          const results = res.rows;
          res.render('pages/db', results);
          /*for (let row of res.rows) {
            console.log(JSON.stringify(row));
          } */
          client.end();
        });
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));