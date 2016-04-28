import React, { PropTypes } from 'react';

const Stock = ({ isFavourite, stock, bindings }) => (
    <div className="search-result">
        <div className="details" onClick={() => bindings.onClick(stock)}>
            <div className="name">{stock.name}</div>
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
