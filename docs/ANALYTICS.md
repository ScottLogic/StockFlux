# Tracking
StockFlux uses [Google Analytics](https://analytics.google.com). This documents describes what's tracked and how.

## Tracking events
Specific events are sent to Google Analytics using custom Redux middleware. To track an event, add an `analyticsEvent` property to a Redux action as an object with `category` and `action` properties.

For example, an action creator for search can also have its event sent to Google Analytics by returning an action like this:

```js
function search(term) {
    return {
        type: 'SEARCH',
        term,
        analyticsEvent: {
            category: 'Search',
            action: term
        }
    };
}
```

These will show in [Google Analytics](https://analytics.google.com) under Behaviour -> Events.

Existing events include:
- Toggle favourite
- Search
- Select stock
- Show search
- Show favourites
- Window minimized
- Window maximized
- Window compact
- Window standard

## Traffic from different releases
Our releases are currently split as
> /StockFlux/RELEASE_TYPE/index.html

Practical examples of this are:

> /StockFlux/master/index.html

> /StockFlux/dev/index.html

> /StockFlux/10.1.0/index.html

GA treats different directories separately, giving us what pages where accessed in which release.
