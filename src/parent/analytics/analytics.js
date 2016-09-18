/* eslint global-require: 0 */

// Include Google analytics JavaScript tracking snippet
// https://developers.google.com/analytics/devguides/collection/analyticsjs/
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./analytics.prod').default;
} else {
    module.exports = require('./analytics.dev').default;
}
