const app = require('express')();
const config = require('./config');
const proxyOverride = require('./proxyOverride');

const { baseUrl, port = 3000 } = config;

app.get('/**', proxyOverride(baseUrl));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
