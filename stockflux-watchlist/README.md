## StockFlux Watchlist

StockFlux Watchlist is a part of StockFlux app suite intended to work with StockFlux Launcher, Chart, and News apps.
Watchlist is an app containing the list of symbols the user is watching. These symbols are displayed as cards containing key symbol information and a minichart of the symbol's price fluctuations in the last 30 days.

### Opening Watchlist App

-   The watchlist app can be launched/opened through the launcher app by clicking on StockFlux-watchlist app icon in the top left corner of the launcher.
-   It can be launched/opened through the launcher's search: search for a symbol, then when the list of symbols is loaded click on watchlist-icon of a particular symbol and that wymbol will be added to the watchlist subsequently openning the watchlist window.
-   It can be launched/opened on its own by doing `npm start` inside the `stockflux-watchlist` folder.

### Watchlist Card Functionality

-   Dragging a Watchlist card out of the Watchlist borders opens the StockFlux Chart app.
-   Each card has a News app icon, clicking on it opens the list of news regarding that symbol.
-   Each card also has the 'X' icon, clicking on it removes the symbol from the watchlist.
