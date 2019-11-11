## StockFlux News

StockFlux News is a part of StockFlux app suite intended to work with StockFlux Launcher, Chart, and Watchlist apps.
News is an app used to search for news stories related to a symbol. Each news story can be clicked on and will open in a secure iFrame that has no access to the Openfin API.

### Launching StockFlux News app from the installer

Download the [installer](https://install.openfin.co/download/?os=win&config=https%3A%2F%2Fstockflux.scottlogic.com%2Fapi%2Fapps%2Fv1%2Fstockflux-launcher%2Fapp.json&fileName=stockflux&unzipped=true). After installing `StockFlux Launcher` icon should appear on the desktop. Double click it to open the StockFlux Launcher.

StockFlux News can be launched from the launcher app:

- by clicking on StockFlux News app icon in the top left corner of the launcher
- by searching for a symbol using launcher's input field. When the list of symbols loads, click on the news icon of a particular symbol and that will open a new instance of the news app and search for stories related to that symbol.

### Running locally

In order to launch the StockFlux News app locally, StockFlux Core and StockFlux Components have to be built first.
Run the following commands in the root package to make lerna do the heavy lifting for you:

```bash
npm install
npm run bootstrap
npm run build
```


To start and launch the StockFlux News:

```bash
npm start
npm run launch
```

Unfortunately at the time of writing, the news application will only search for a symbol if it is provided over the Openfin InterApplicationBus.
Work is planned to include a search bar to allow the application to function standalone.

To launch other StockFlux apps locally read the `README.md` files in the project folders.
