const configBuilder = require('openfin-config-builder');

if (process.argv.length <= 2) {
    console.log('Usage: ' + __filename + ' <deployName>');
    process.exit(-1);
}

const deployName = process.argv[2];
const deployedUrl = 'http://rjmcneill.github.io/StockFlux/' + deployName + '/';

configBuilder.update({
    startup_app: {
        url: deployedUrl + 'parent.html',
        applicationIcon: deployedUrl + 'favicon.ico'
    },
    shortcut: {
        icon: deployedUrl + 'favicon.ico'
    },
    splashScreenImage: deployedUrl + 'splashscreen.png'
}, 'public/app.prod.json').then(() => {
    console.log('Updating of app.prod.json succeeded');
}).fail((err) => {
    console.log('Updating of app.prod.json failed:', err);
});
