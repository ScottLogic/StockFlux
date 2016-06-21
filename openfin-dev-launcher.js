const openfinLauncher = require('openfin-launcher');

openfinLauncher.launchOpenFin({
    configPath: 'http://localhost:5000/app.dev.json'
})
.then(() => {
    console.log('success!');
})
.catch(console.error);
