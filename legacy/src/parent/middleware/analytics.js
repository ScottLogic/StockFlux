/* global ga */

/**
 * This middleware sends metadata about events to Google Analytics
 * https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#send
 *
 * To track an event, add an `analyticsEvent` property to a Redux action as an object with `category` and `action` properties.
 * For example, an action creator for search can also have its event sent to Google Analytics by returning an action like this:
 * {
 *     type: 'SEARCH',
 *     term: 'a search term',
 *     analyticsEvent: {
 *         category: 'Search',
 *         action: 'a search term'
 *     }
 * }
 */
export default function analyticsMiddleware() {
    return (next) => (action) => {
        if (!action || !action.analyticsEvent) {
            return next(action);
        }

        try {
            ga('send', 'event', {
                eventCategory: action.analyticsEvent.category,
                eventAction: action.analyticsEvent.action
            });
        } catch (e) {
            if (typeof console !== 'undefined' && typeof console.error === 'function') {
                console.error(e);
            }
        }

        return next(action);
    };
}
