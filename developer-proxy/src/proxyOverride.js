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
  const override = overrides[path];

  if (path === '/api/apps/v1') {
    // eslint-disable-next-line no-console
    console.log(`Overriding path '${path}`);
    fetch(override, options)
      .then(proxyRes => {
        return proxyRes.json();
      })
      .then(proxyData => {
        res.send(proxyData);
      })
      .catch(err => console.error('Proxy Error', err));
    return;
  }

  // eslint-disable-next-line no-console
  console.log(
    override ? `Overriding path '${path}'` : `No overrides for path '${path}'`
  );

  fetch(url, options)
    .then(proxyRes => {
      return proxyRes.json();
    })
    .then(proxyData => {
      if (override) {
        const overriddenData = merge(proxyData, overrides[path] || {});
        res.json(overriddenData);
      } else {
        res.send(proxyData); // This helps handle non-overridden ones that are not JSON (aka news feeds)
      }
    })
    .catch(err => console.error('Proxy Error', err));
};
