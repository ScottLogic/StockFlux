import React, { useEffect, useRef } from 'react';
import './chart.css';

let firstRun = true;

const Chart = ({chart, symbol, getData}) => {
    const showcaseContainer = useRef(null);

    useEffect(() => {
        if (firstRun) {
            // calling run will use random generated data when no symbol is set
            chart.run(showcaseContainer.current);
            firstRun = false;
        }
        if (symbol && getData) {
            getData(symbol);
        }
    }, [symbol]);

    return (
        <div ref={showcaseContainer} id = "showcase-container" />
    );
};

export default Chart;