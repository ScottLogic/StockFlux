const fetch = require('node-fetch');
const merge = require('deepmerge');
const config = require('./config');

module.exports = baseUrl => (req, res) => {
  const { method, path } = req;
  const { overrides = {} } = config;

  const options = {
    method,
    mode: 'no-cors',
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow'
  };

  const url = baseUrl + path;

  console.log(
    overrides[path]
      ? `Overriding path '${path}'`
      : `No overrides for path '${path}'`
  );

  fetch(url, options)
    .then(proxyRes => {
      console.log(proxyRes);
      return proxyRes.json();
    })
    .then(proxyData => {
      const overriddenData = merge(proxyData, overrides[path] || {});
      console.log(overriddenData);
      res.json(overriddenData);
    })
    .catch(err => console.error(err));
};
