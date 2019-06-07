import React, { useEffect, useRef } from 'react';
import bitflux from 'stockflux-bitflux/dist/bitflux';
import './chart.css';

const chart = bitflux.app();
chart.periodsOfDataToFetch(1200);
chart.proportionOfDataToDisplayByDefault(112/1200);
let firstRun = true;

export default function Chart({symbol}) {
    const showcaseContainer = useRef(null);
    
    useEffect(() => {
        if (firstRun) {
            // calling run will use random generated data when no symbol is set
            chart.run(showcaseContainer.current);
            firstRun = false;
        }
        if (symbol) {
            chart.changeStockFluxProduct(symbol);
        }
    }, [symbol]);

    return (
            <div ref={showcaseContainer} id = "showcase-container" />
    );
};