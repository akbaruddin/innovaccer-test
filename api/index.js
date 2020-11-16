const express = require('express');
const bodyParser = require('body-parser');
const cros = require('cors');
const app = express();

require('dotenv').config()

const patients = require('./src/patients');

const port = process.env.PORT || 8080;

app.use(cros());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/patients', patients);

app.get('/', (req, res) => {
  res.send({ api: 'patients API List' })
})

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
