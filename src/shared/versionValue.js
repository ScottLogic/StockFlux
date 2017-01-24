/* eslint global-require: 0 */

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./versionValue.prod.js').default;
} else {
    module.exports = require('./versionValue.dev.js').default;
}
