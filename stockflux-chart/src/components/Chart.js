import React, { useEffect, useState, useRef } from 'react';
import {InterApplicationBusHooks} from 'openfin-react-hooks';
import bitflux from 'stockflux-bitflux/dist/bitflux';
import './chart.css';

const chart = bitflux.app();
chart.periodsOfDataToFetch(1200);
chart.proportionOfDataToDisplayByDefault(112/1200);

export default function Chart() {
    const [symbol, setSymbol] = useState(null);

    const showcaseContainer = useRef(null);
    // calling run will use random generated data
    
    useEffect(() => {
        chart.run(showcaseContainer.current);
        if (symbol) {
            chart.changeStockFluxProduct(symbol);
        }
    }, [symbol, showcaseContainer]);

    InterApplicationBusHooks.useSubscription('*', 'Chart', 'stockFlux:symbol');

    const handleSymbolChange = e => {
        if(symbol === null || symbol === 'MSFT') {
            setSymbol('AAPL');
        } else if (symbol === 'AAPL') {
            setSymbol('MSFT');
        }
    }

    return (
        <>
            <button onClick={handleSymbolChange}>SYMBOL</button>
            <div ref={showcaseContainer} id = "showcase-container" />
        </>
    );
};