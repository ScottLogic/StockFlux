import React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'classnames';

import { Utils } from 'stockflux-core';

import styles from './SearchResult.module.css';

const SearchResult = ({ stock, selected, onResultClick, onFavouriteClick }) => {
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
  });

  return (
    <div className={cls}>
      <div className={styles.details} onClick={() => onResultClick(stock.code, stock.name)}>
        <div className={styles.name}>{Utils.truncate(stock.name)}</div>
        <div className={styles.code}>{stock.code}</div>
      </div>
      <div className={starCls} onClick={() => onFavouriteClick(stock.code)}>
        &nbsp;
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  stock: PropTypes.shape({
    name: PropTypes.string, // temporarily undefined when dragged from another window
    code: PropTypes.string.isRequired
  }).isRequired,
  onFavouriteClick: PropTypes.func.isRequired,
  onResultClick: PropTypes.func.isRequired,
};

export default SearchResult;
