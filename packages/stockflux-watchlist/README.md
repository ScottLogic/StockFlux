## StockFlux Watchlist

StockFlux Watchlist is a part of StockFlux app suite intended to work with StockFlux Launcher, Chart, and News apps.
Watchlist is an app containing the list of symbols the user is watching. These symbols are displayed as cards containing key symbol information and a minichart of the symbol's price fluctuations in the last 30 days.

### Launching StockFlux Watchlist app from the installer

Download the [installer](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fstockflux.scottlogic.com%2Fapi%2Fapps%2Fv1%2Fstockflux-launcher%2Fapp.json&fileName=stockflux&unzipped=true). After installing `StockFlux Launcher` icon should appear on the desktop. Double click it to open the StockFlux Launcher.

StockFlux Watchlist can be launched from the launcher app:

- by clicking on StockFlux Watchlist app icon in the top left corner of the launcher
- by searching for a symbol using launcher's input field. When the list of symbols loads, click on the watchlist icon of a particular symbol and that symbol will be added to the watchlist subsequently launching the Watchlist app.

### Watchlist card functionality

- Dragging and dropping a Watchlist card outside the Watchlist borders opens the StockFlux Chart app for that symbol.
- Clicking on a minichart in the Watchlist card also opens the StockFlux Chart app for that symbol.
- Each card has a News app icon, clicking on it opens the list of news regarding that symbol.
- Each card also has the `X` icon, clicking on it removes the symbol from the watchlist.

### Running locally

In order to launch the StockFlux Watchlist app locally, StockFlux Core and StockFlux Components have to be built first.

```bash
cd stockflux-core
npm run build
cd stockflux-components
npm run build
```

Then install StockFlux Watchlist dependencies.

```bash
cd stockflux-watchlist
npm install
```

To start and launch the StockFlux Watchlist:

```bash
npm start
npm run launch
```

To launch other StockFlux apps locally read the `README.md` files in the project folders.
