# Tracking
StockFlux uses Google Analytics. This documents describes what's tracked and how.

## Tracking events
Use the global ```function reportAction(category, action) ``` to add tracking to a user action.

These will show in [google analytics](analytics.google.com) under Behavour -> Events

Existing events include:
- Window change
- Tearout
- Select favourite
- Show
- Search
- Add Favorite
- Remove Favourite
- Select search
- Toggle
- Restore window

Existing action include
- Standard
- Return to same
- Start
- Compact
- Maximised
- Search

## Traffic from different releases
Our releases are currently split as
> /StockFlux/RELEASE_TYPE/index.html

Practical examples of this are:

> /StockFlux/master/index.html

> /StockFlux/dev/index.html

> /StockFlux/10.1.0/index.html

GA treats different directories separately, giving us what pages where accessed in which release.





