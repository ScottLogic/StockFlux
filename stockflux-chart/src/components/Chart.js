import React, { useEffect, useState } from 'react';
import {InterApplicationBusHooks} from 'openfin-react-hooks';
import bitflux from 'stockflux-bitflux/dist/bitflux';
import './chart.css';

export default function Chart() {
    const [symbol, setSymbol] = useState(null);

    let showcaseContainer;
    const chart = bitflux.app();
    chart.periodsOfDataToFetch(1200);
    chart.proportionOfDataToDisplayByDefault(112/1200);
    // calling run will use random generated data
    
    useEffect(() => {
        chart.run(showcaseContainer);
        if (symbol) {
            chart.changeScottStockProduct(symbol);
        }
        // eslint-disable-next-line
    }, [symbol]);

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
            <div ref = {ref => { showcaseContainer = ref; }} id = "showcase-container" />
        </>
    );
};