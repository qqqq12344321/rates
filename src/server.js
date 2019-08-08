const mysql = require("mysql");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { promisify } = require("util");

var connection = mysql.createConnection({
	database: 'tradair',
	host: "63.33.172.234",
	port: 3554,
	user: "guest",
	password: "GHE3FJU"
}, err => console.log(err));


connection.connect();


var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', 5000);


const query = promisify(connection.query).bind(connection);

async function getRate(pair) {
  return await query(
  `
    SELECT rate, time_created 
    FROM currency_pairs JOIN rates 
    ON rates.currency_pair_id = currency_pairs.id
    WHERE currency_pairs.name = '${pair}'
  `)
}

function handleRejection(p) {
  return p.catch(err=> ({ error: err }));
}

app.get('/api/rates/', (req, response, next) => {
  Promise.all([getRate("EUR/USD"), getRate("EUR/BTC"), getRate("EUR/ILS")].map(p => p.catch(err=> ({ error: err })) ))
  .then(result => {
    response.send(JSON.stringify({
      "EUR/USD":result[0],
      "EUR/BTC":result[1],
      "EUR/ILS":result[2]
    }))
  })
  .catch(err => response.send(err));
})


app.listen(app.get('port'), function() {
  console.log(`Express server listening on port ${app.get('port')}`);
})