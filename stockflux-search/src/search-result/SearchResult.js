import React from 'react';
import * as PropTypes from 'prop-types';
import * as fdc3 from 'openfin-fdc3';

import styles from './SearchResult.module.css';

const format = name => {
    const openBracketIndex = name.indexOf('(');
    return openBracketIndex === -1 ? name : name.slice(0, openBracketIndex - 1);
};

const handleWatchlistAddClick = (code, name) => {
    fdc3.raiseIntent('WatchlistAdd', {
        type: 'security',
        name,
        id: {
            default: code
        }
    });
};

const SearchResult = ({ code, name }) => (
    <div className={styles.searchResult}>
        <div className={styles.name}>{format(name)}</div>
        <div className={styles.subtitle}>{code}</div>
        <div className={styles.containerActions}>
            <button type="button" className={styles.buttonAction} onClick={() => handleWatchlistAddClick(code, name)}>Add to Watchlist</button>
            <button type="button" className={styles.buttonAction}>Add to Chart</button>
        </div>
    </div>
);

SearchResult.propTypes = {
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};

export default SearchResult;
