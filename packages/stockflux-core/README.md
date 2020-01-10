## StockFlux Core

StockFlux-Core is a part of the StockFlux application suite. It is a library of shared services, hooks and util functions used by the core set of applications.

### Install

Currently the library is used locally across the other Stockflux applications.

Before you run an application that has the components library as a dependency you must build the components. To do so run the following command in the Stockflux-core directory:

```bash
npm install
npm run build
```

It is added as a dependency in the target applications `package.json` like so:

```json
"dependencies": {
    "stockflux-core": "file:../stockflux-core",
}
```

### Usage

The default export for Core is comprised of 4 exports:

#### Custom Hooks

```javascript
import { StockFluxHooks } from 'stockflux-core';
```

The custom hooks export is comprised of a single hook.

```javascript
export const StockFluxHooks = {
  useLocalStorage
};
```

This hook allows the user to save a value to local storage.

```javascript
  const [symbol, setSymbol] = StockFluxHooks.useLocalStorage('symbol', null);
```

The first parameter passed into function is the key that your value will be stored in local storage with. The second is the default value that will be initially saved.
Calling `setSymbol` will now store a value into local storage under the key `symbol`. For more on Hooks and how to use them please refer to the [React Hooks documentation](https://reactjs.org/docs/hooks-intro.html).

#### Intents

```javascript
import { Intents } from 'stockflux-core';
```

Across the suite of applications we need to be able to launch other applications. This is done via [Intents](https://fdc3.finos.org/docs/next/intents-intro).

As part of the intents export we provide 4 methods:

```javascript
export const Intents = {
  viewChart,
  viewNews,
  addWatchlist,
  viewWatchlist
};
```

For each of these methods we recommend an [Intent listener](https://github.com/FDC3/FDC3/blob/master/docs/api/DesktopAgent.md#addintentlistener) is set up in the target Application.

##### View Chart

To view a chart for a symbol with the intent `ViewChart`:

```javascript
Intents.viewChart(symbol, name);
```

The context a listener will recieve will be in the following format:

```javascript
{
    "type": "security",
    "name": symbol,
    "appName": "stockflux-chart",
    "id": {
        "default": name,
    }
}
```

##### View News

To view news for a symbol with the intent `ViewNews`:

```javascript
Intents.viewNews(symbol);
```

The context a listener will recieve will be in the following format:

```javascript
{
    "type": "news",
    "name": symbol
    "appName": "stockflux-news"
}
```

##### Add to Watchlist

To send a symbol to the watchlist with the intent `WatchlistAdd`:

```javascript
Intents.addWatchlist(symbol, name);
```

The context a listener will recieve will be in the following format:

```javascript
{
    "type": "security",
    "name": name,
    "id": {
        "default": symbol
    }
}
```

##### View Watchlist

To open the watchlist with the intent `WatchlistView`:

```javascript
Intents.viewWatchlist();
```

The context a listener will recieve will be in the following format:

```javascript
{
    "type": "security"
}
```

#### Services

```javascript
import { StockFlux } from 'stockflux-core';
```

The set of services are used to interact with our set of [APIs](https://github.com/ScottLogic/StockFlux-Cloud).

```javascript
export const StockFlux = {
  stockFluxSearch,
  getStockFluxData,
  getMiniChartData,
  getSymbolNews
};
```

##### Search

```javascript
StockFlux.stockFluxSearch(symbol);
```

Symbol is a string passed into the method which returns a promise. If successfully resolved the results will be returned in the following format:

```javascript
{
    "success": true,
    "data": [
        {
            "symbol": "AAPL",
            "name": "Apple Inc."
        }
    ],
    "pagination": {
        "page": 1,
        "perPage": 100,
        "totalItems": 1,
        "totalPages": 1
    }
}
```

On error the following will be returned:

```javascript
{
    "error": "There was an error",
    "success": false
}
```

Pagination has not yet been implemented by the service.

##### Get minichart data

```javascript
StockFlux.getMiniChartData(symbol);
```

Symbol is a string passed into the method which returns a promise. If successfully resolved an array of results will be returned in the following format:

```javascript
{
    "success": true,
    "data": {
        "ohlc": [{
            "date": "2019-01-02",
            "open": 12.19,
            "high": 14.08,
            "low": 12.06,
            "close": 12.85,
            "volume": 536486
        }],
        "symbol": "AAPL",
        "name": "Apple",
        "industry": "Technology"
    }
}
```

On error the following will be returned:

```javascript
{
    "error": "There was an error",
    "success": false
}
```

##### Get news for a symbol

```javascript
StockFlux.getSymbolNews(symbol);
```

Symbol is a string passed into the method which returns a promise. If successfully resolved an array of results will be returned in the following format:

```javascript
[
    {
        "title": "Title",
        "summary": "News summary",
        "source": "Source",
        "time": 1561646939000,
        "url": "https://cloud.iexapis.com/v1/news/article/XXXX"
    }
]
```

On error the following will be returned:

```javascript
{
    "error": "There was an error",
    "success": false
}
```

##### Get stockflux data

```javascript
StockFlux.getStockFluxData();
```

This service is different compared to the rest. It has been developed to match the data model of [d3fc-financial-feed](https://github.com/ScottLogic/d3fc-financial-feed) as it is what Bitflux expects to handle.

#### Utils

```javascript
import { Utils } from 'stockflux-core';
```

Currently Utils is comprised of a single method:

```javascript
export const Utils = {
  truncate
};
```

`Truncate` is written to extract a string from a set of `()` brackets.
e.g. `Utils.truncate('(MSFT)')` would be return `MSFT`.
