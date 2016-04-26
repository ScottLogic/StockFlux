import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { truncate } from '../services/formatters';

const Favourite = ({ stock, selected, bindings }) => {
    const cls = classNames({
        selected,
        dark: selected
    });

    // <div class="favourite darkens selection() !== stock.code ? '' : ' dark'}} tearable {{single()}}" ng-click="singleClick(stock)" ng-dblclick="doubleClick(stock)" draggable="false"
    return (
        <div>
            <div className="drop-target">
                <div className={`darkens favourite tearable ${cls}`} onClick={() => bindings.onClick(stock)} ng-click="singleClick(stock)" ng-dblclick="doubleClick(stock)" draggable="false">
                    <div className="top">
                        <star stock="stock" confirm="true"></star>
                        <div className="name">{truncate(stock.name)}</div>
                        <div className="code">{stock.code.toUpperCase()}</div>
                    </div>
                    <div className="bottom">
                        <minichart stock="stock"></minichart>
                        <div className="details">
                            <div className="price">stock.price | number:2 </div>
                            <div className="delta">stock.delta  0 ? '' : '+'stock.delta | number:2 </div>
                            <div className="percentage"><img ng-src="assets/png/{{icon(stock)}}.png" className="stock-arrow" draggable="false" />stock.percentage | number:2 %</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hover-area"></div>
        </div>
        );
};


// onClick: PropTypes.func.isRequired,
Favourite.propTypes = {
    stock: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    bindings: PropTypes.object.isRequired
};

export default Favourite;
