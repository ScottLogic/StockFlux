const openfinLauncher = require('openfin-launcher');

module.exports = (configPath) => {
    console.log('Launching application with config path:', configPath);
    openfinLauncher
        .launchOpenFin({ configPath })
        .then(() => { console.log('Successfully launched'); })
        .catch(console.error);
};
