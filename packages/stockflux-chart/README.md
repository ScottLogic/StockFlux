## StockFlux Chart

StockFlux Chart is a part of StockFlux app suite intended to work with StockFlux Launcher, Watchlist, and News apps.
Chart is an application designed to provide an interactive view of a symbol's OHLC(Open, High, Low and Close) data over the last 5 years.

### Launching StockFlux Chart app from the installer

Download the [installer](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fstockflux.scottlogic.com%2Fapi%2Fapps%2Fv1%2Fstockflux-launcher%2Fapp.json&fileName=stockflux&unzipped=true). After installing `StockFlux Launcher` icon should appear on the desktop. Double click it to open the StockFlux Launcher.

StockFlux Chart can be launched from the launcher app:

- by clicking on StockFlux Chart app icon in the top left corner of the launcher
- by searching for a symbol using launcher's input field. When the list of symbols loads, click on the chart icon of a particular symbol and the chart application will be launched.

### Chart functionality

The user can view data over the period of 5 years. The chart allows the user to zoom in on a period of time for a more focused view. Overlays can be toggled on and off to provide extra information about the OHLC data. By default the OHLC is displayed by a series of candles, this can be changed by the user.

### Running locally

In order to launch the StockFlux Chart app locally, StockFlux Core, StockFlux Components and Stockflux Bitflux have to be built first.

```bash
cd stockflux-core
npm run build
cd stockflux-components
npm run build
cd stockflux-bitflux
npm run build
```

Then install StockFlux Chart dependencies.

```bash
cd stockflux-chart
npm install
```

To start and launch the StockFlux Chart:

```bash
npm start
npm run launch
```

If no symbol is provided from the Openfin context generated data is shown.

To launch other StockFlux apps locally read the `README.md` files in the project folders.
