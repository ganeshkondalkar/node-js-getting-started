const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');

const pool = new Pool({
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
        const client = await pool.connect();
        const results = await client.query('SELECT * FROM test_table');
        console.log('RESULTS: ', results.rows);
        console.log('typeof RESULTS: ', typeof results.rows);
        // res.render('pages/db', results.rows);
        const rows = JSON.parse( JSON.stringify(results.rows) );
        res.render( 'pages/db', {rows} );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));