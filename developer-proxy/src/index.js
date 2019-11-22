const path = require('path');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const proxyOverride = require('./proxyOverride');

const { baseUrl, port = 3000 } = config;

const app = express();

app.use(cors());
app.use('/__static', express.static(path.join(__dirname, './static')));

app.get('/**', proxyOverride(baseUrl));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
