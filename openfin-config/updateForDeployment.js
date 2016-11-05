const semver = require('semver');
const configBuilder = require('openfin-config-builder');

if (process.argv.length <= 2) {
    console.error(`Usage: node ${__filename} <deployName>`);
    process.exit(1);
}

const deployName = process.argv[2];

const validDeployableBranchNames = ['master', 'dev'];
const isInvalidDeployableBranchName = (name) => validDeployableBranchNames.indexOf(name) === -1;
const isInvalidSemver = (name) => semver.valid(name) === null;

if (isInvalidSemver(deployName) && isInvalidDeployableBranchName(deployName)) {
    console.error('Deploy name must be a valid semver, "master", or "dev"');
    process.exit(1);
}

const deployedUrl = `http://scottlogic.github.io/StockFlux/${deployName}/`;

configBuilder.update({
    startup_app: {
        url: `${deployedUrl}parent.html`,
        applicationIcon: `${deployedUrl}favicon.ico`
    },
    shortcut: {
        icon: `${deployedUrl}favicon.ico`
    },
    splashScreenImage: `${deployedUrl}splashscreen.png`
}, 'public/app.json').then(() => {
    console.log('Updating of app.json succeeded');
}).fail((err) => {
    console.error('Updating of app.json failed:', err);
    process.exit(1);
});
