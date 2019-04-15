import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

import { truncate } from '../utils/formatters';

import styles from './SearchResult.module.css';

const Stock = ({ isFavourite, stock, selected, bindings }) => {
    const cls = classNames({
        [styles.searchResult]: true,
        darkens: true,
        selected,
        dark: selected
    });

    const starCls = classNames({
        [styles.star]: true,
        star: true,
        'button-icon': true,
        active: isFavourite
    })

    return (
        <div className={cls}>
            <div className={styles.details} onClick={() => bindings.onClick(stock.code, stock.name)}>
                <div className={styles.name}>{truncate(stock.name)}</div>
                <div className={styles.code}>{stock.code}</div>
            </div>
            <div className={starCls} onClick={() => bindings.onIconClick(stock.code)}>
                &nbsp;
            </div>
        </div>
    );
};

Stock.propTypes = {
    stock: PropTypes.shape({
        name: PropTypes.string, // temporarily undefined when dragged from another window
        code: PropTypes.string.isRequired
    }).isRequired,
    bindings: PropTypes.shape({
        onClick: PropTypes.func.isRequired,
        onIconClick: PropTypes.func.isRequired
    }).isRequired,
    isFavourite: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired
};

export default Stock;
