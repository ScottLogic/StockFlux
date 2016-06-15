/* eslint global-require: 0 */

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./configureStore.prod.js').default;
} else {
    module.exports = require('./configureStore.dev.js').default;
}
