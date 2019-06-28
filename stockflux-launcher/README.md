## StockFlux Launcher

StockFlux Launcher is a part of StockFlux app suite intended to work with StockFlux Watchlist, Chart, and News apps. The launcher is considered to be the centre of the StockFlux application suite. It is used to launch the other applications either directly via icons or by searching for a symbol and opening using the results returned.

### Running locally

In order to launch the StockFlux Launcher app locally, StockFlux Core and StockFlux Components have to be built first.

```bash
cd stockflux-core
npm run build
cd stockflux-components
npm run build
```

Then install StockFlux Launcher dependencies.

```bash
cd stockflux-launcher
npm install
```

To start and launch the StockFlux Launcher:

```bash
npm start
npm run launch
```

To launch other StockFlux apps locally read the `README.md` files in the project folders.

### Launching StockFlux Launcher app from the installer

Download the [installer](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fd2v92tgq94yxaa.cloudfront.net%2Fapi%2Fapps%2Fv1%2Fstockflux-launcher%2Fapp.json&fileName=stockflux-installer&unzipped=true). After installing `StockFlux Launcher` icon should appear on the desktop. Double click it to open the StockFlux Launcher.

### Launcher functionality

- The launcher's main feature is the search bar in the middle of the application. The user can search for a symbol and then launch one of our 3 applications, Chart, News or Watchlist.
- The 3 apps can be launched on their own without searching for a symbol. Each icon in the left side of the Application relates to each app. When this is done the for the News and Chart application the symbol "AAPL" is used as a default.
- Once an application has been launched the launcher can be closed. It will not effect the application you have just opened.
- The launcher can be docked to the top, left and right of the screen. It can also be dragged to any other position on the screen.
