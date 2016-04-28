import React, { PropTypes } from 'react';
import { truncate } from '../services/formatters';

const Stock = ({ isFavourite, stock, bindings }) => (
    <div className="search-result">
        <div className="details" onClick={() => bindings.onClick(stock)}>
            <div className="name">{truncate(stock.name)}</div>
            <div className="code">{stock.code}</div>
        </div>
        <div className={'button-icon star' + (isFavourite ? ' active' : '')} onClick={() => bindings.onIconClick(stock)}>
            &nbsp;
        </div>
    </div>
    );

Stock.propTypes = {
    stock: PropTypes.object.isRequired,
    bindings: PropTypes.object.isRequired,
    isFavourite: PropTypes.bool.isRequired
};

export default Stock;
