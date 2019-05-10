import React, { useEffect } from 'react';
import bitflux from 'stockflux-bitflux/dist/bitflux';
import './chart.css';

export default function Chart() {
    let showcaseContainer;
    const chart = bitflux.app();
    useEffect(() => {

        chart.periodsOfDataToFetch(1200);
        chart.proportionOfDataToDisplayByDefault(112/1200);
        // using random generated data
        chart.run(showcaseContainer);

        // hardcoded to test functionality
        chart.changeScottStockProduct('MSFT');

        // TODO take symbol as a prop
        // make api request with symbol
        // render chart with data
    });

    return (
        <div ref = {(ref) => { showcaseContainer = ref; }} id = "showcase-container" />
    );
};