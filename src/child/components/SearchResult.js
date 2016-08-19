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
            <div className="details" onClick={() => bindings.onClick(stock.code, stock.name)}>
                <div className="name">{truncate(stock.name)}</div>
                <div className="code">{stock.code}</div>
            </div>
            <div className={`button-icon star${(isFavourite ? ' active' : '')}`} onClick={() => bindings.onIconClick(stock.code)}>
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
