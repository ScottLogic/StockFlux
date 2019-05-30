import React from 'react';
import * as fdc3 from 'openfin-fdc3';
import * as PropTypes from 'prop-types';
import { Utils, Intents } from 'stockflux-core';

import styles from './SearchResult.module.css';

const handleWatchlistAddClick = (code, name) => {
    fdc3.raiseIntent('WatchlistAdd', {
        type: 'security',
        name,
        id: {
            default: code
        }
    });
};

const handleChartAddClick = async (code, name) => {
    Intents.viewChart(code, name);
};

const handleViewNewsClick = async (code) => {
    Intents.viewNews(code);
}

const SearchResult = ({ code, name }) => (
    <div className={styles.searchResult}>
        <div className={styles.name}>{Utils.truncate(name)}</div>
        <div className={styles.subtitle}>{code}</div>
        <div className={styles.containerActions}>
            <button type="button" className={styles.buttonAction} onClick={() => handleViewNewsClick(code)}>View News</button>
            <button type="button" className={styles.buttonAction} onClick={() => handleWatchlistAddClick(code, name)}>Add to Watchlist</button>
            <button type="button" className={styles.buttonAction} onClick={() => handleChartAddClick(code, name)}>Add to Chart</button>
        </div>
    </div>
);

SearchResult.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default SearchResult;
