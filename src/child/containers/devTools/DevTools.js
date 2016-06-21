/* eslint global-require: 0 */

if (process.env.NODE_ENV === 'production') {
    module.exports = null;
} else {
    module.exports = require('./DevTools.dev.js').default;
}
