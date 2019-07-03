## Stockflux Container

StockFlux Container is a part of StockFlux app suite intended to support the creation of multiple Chart and News apps.
The container ran in headless mode so you will not see a window running for the application. It's primary purpose is to listen for Chart and News application intents and manage child windows based on the intent sent.

### Running locally

In order to launch the StockFlux Container app locally, StockFlux Core and StockFlux Components have to be built first.

```bash
cd stockflux-core
npm run build
cd stockflux-components
npm run build
```

Then install StockFlux Container dependencies.

```bash
cd stockflux-container
npm install
```

To start and launch the StockFlux Container:

```bash
npm start
npm run launch
```

If you wish to see a window launched for the container for debugging purposes please change the `autoShow` and `frame` values in `app.dev.json` to `true`.

To launch other StockFlux apps locally read the `README.md` files in the project folders.
