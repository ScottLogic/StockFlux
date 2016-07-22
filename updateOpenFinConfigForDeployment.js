const semver = require('semver');
const configBuilder = require('openfin-config-builder');

if (process.argv.length <= 2) {
    console.error(`Usage: node ${__filename} <deployName>`);
    process.exit(1);
}

const deployName = process.argv[2];
const deployedUrl = `http://rjmcneill.github.io/StockFlux/${deployName}/`;

if ((semver.valid(deployName) !== (deployName)) && (deployName !== 'master') && (deployName !== 'dev') && (deployName !== 'chore/deployable-build')) {
    process.exit(1);
}

configBuilder.update({
    startup_app: {
        url: `${deployedUrl}parent.html`,
        applicationIcon: `${deployedUrl}favicon.ico`
    },
    shortcut: {
        icon: `${deployedUrl}favicon.ico`
    },
    splashScreenImage: `${deployedUrl}splashscreen.png`
}, 'public/app.prod.json').then(() => {
    console.log('Updating of app.prod.json succeeded');
}).fail((err) => {
    console.error('Updating of app.prod.json failed:', err);
});
