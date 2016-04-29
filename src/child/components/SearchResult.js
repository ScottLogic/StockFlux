import React, { PropTypes } from 'react';
import { truncate } from '../services/formatters';
import classNames from 'classnames';

const Stock = ({ isFavourite, stock, selected, bindings }) => {

    const cls = classNames({
        'search-result': true,
        darkens: true,
        selected,
        dark: selected
    });

    return (
        <div className={cls}>
            <div className="details" onClick={() => bindings.onClick(stock)}>
                <div className="name">{truncate(stock.name)}</div>
                <div className="code">{stock.code}</div>
            </div>
            <div className={'button-icon star' + (isFavourite ? ' active' : '')} onClick={() => bindings.onIconClick(stock)}>
                &nbsp;
            </div>
        </div>
    );
};

Stock.propTypes = {
    stock: PropTypes.object.isRequired,
    bindings: PropTypes.object.isRequired,
    isFavourite: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired
};

export default Stock;
