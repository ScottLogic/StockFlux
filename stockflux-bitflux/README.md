# StockFlux Bitflux

***BitFlux has been deprecated and will be replaced directly by D3FC in future versions***

**A cross-platform financial charting application to showcase the functionality of [d3fc](https://d3fc.io) components.**


## Initial Setup

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Navigate to the root of your local copy of this project and install the dependencies:

```bash
npm install
```

- Perform an initial build:

```bash
npm run build
```

## Usage

Like Core and Components it must be added to the `package.json`

 ```json
"dependencies": {
    "stockflux-bitflux": "file:../stockflux-bitflux",
}
```

Before using the library you must perform the above Initial Setup steps

### Importing the library

```javascript
import bitflux from 'stockflux-bitflux/dist/bitflux';
```

### Example use

```javascript
import React, { useRef } from 'react';
import bitflux from 'stockflux-bitflux/dist/bitflux';

// grab instance of the chart app
const chart = bitflux.app();

// configure how the data will be rendered
chart.periodsOfDataToFetch(1200);
chart.proportionOfDataToDisplayByDefault(112/1200);

const renderChart = () => {
    // set up a ref of the DOM element where the chart will be rendered
    const showcaseContainer = useRef(null);

    // run the chart in the chosen element
    chart.run(showcaseContainer.current);
    // make a request for data with the symbol "MSFT"
    chart.changeStockFluxProduct("MSFT");

    return (
        <div ref={showcaseContainer} id = "showcase-container" />
    );
}
```
