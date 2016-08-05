import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { truncate } from '../services/formatters';
import Minichart from './minichart/Minichart.js';
import { getStockData as quandlServiceGetStockData } from '../services/QuandlService.js';

import arrowUp from '../assets/png/arrow_up.png';
import arrowDown from '../assets/png/arrow_down.png';

class Favourite extends Component {

    constructor(props) {
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);
    }

    componentDidMount() {
        const stockCode = this.props.stockCode;
        quandlServiceGetStockData(stockCode)
            .then(response => {
                const data = response.stockData.data[0];
                const stockName = response.dataset.name;
                const stockData = {
                    name: stockName,
                    price: data.close,
                    delta: data.close - data.open,
                    percentage: (data.close - data.open) / data.open * 100
                };
                const chartData = response;
                this.props.bindings.onQuandlResponse(stockCode, stockName);
                this.setState({ stockData, chartData });
            });
    }

    onIconClick(e) {
        e.stopPropagation();
        this.props.bindings.onIconClick(this.props.stockCode);
    }

    onMouseOver() {
        this.setState({ isHovered: true });
    }

    onMouseOut() {
        this.setState({ isHovered: false });
    }

    onDragStart(stockCode) {
        return e => {
            this.props.bindings.dnd.onDragStart(e, stockCode);
            // TODO: fade out window if it's last stock
            e.currentTarget.classList.add('dragging');
            e.dataTransfer.setData('text/plain', stockCode);
            e.dataTransfer.setData(stockCode, '');  // used to access propery on dragEnter. check getCodeFromDT
        };
    }

    onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    onDragLeave(e) {
        e.currentTarget.classList.remove('dragOver');
    }

    onDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        if (e.dataTransfer.dropEffect === 'none') {
            // TODO: Open window with stock + reposition && fade window if it's the only stock in favourites
        }
    }

    render() {
        const { stockCode, selected, bindings } = this.props;

        let { stockData, chartData } = this.state || {};
        const { isHovered } = this.state || {};
        stockData = stockData || {};

        const cls = classNames({
            selected,
            dark: selected,
            hovered: isHovered
        });

        const price = !isNaN(+stockData.price) ? (+stockData.price).toFixed(2) : '';
        const delta = !isNaN(+stockData.delta) ? (+stockData.delta).toFixed(2) : '';
        const percentage = !isNaN(+stockData.percentage) ? Math.abs((+stockData.percentage)).toFixed(2) : '';
        const name = stockData.name ? truncate(stockData.name) : '';

        return (
            <div
              id={`stock_${stockCode}`}
              draggable="true"
              className="favouriteWrapper"
              onClick={() => bindings.onClick(stockCode, name)}
              onDragStart={this.onDragStart(stockCode)}
              onDragOver={this.onDragOver}
              onDragEnter={e => bindings.dnd.onDragEnter(e, stockCode)}
              onDragLeave={this.onDragLeave}
              onDrop={e => bindings.dnd.onDrop(e, stockCode)}
              onDragEnd={this.onDragEnd}
              onDoubleClick={() => bindings.onDoubleClick(stockCode, name)}
              onMouseOver={this.onMouseOver}
              onMouseOut={this.onMouseOut}
            >
                <div className="drop-target">
                    <div className={`darkens favourite tearable ${cls}`} draggable="false">
                        <div className="top">
                            <div className="button-icon star active" onClick={this.onIconClick}>&nbsp;</div>
                            <div className="name">{name}</div>
                            <div className="code">{stockCode.toUpperCase()}</div>
                        </div>
                        <div className="bottom">
                            <Minichart stockCode={stockCode} chartData={chartData} />
                            <div className="details">
                                <div className="price">{price}</div>
                                <div className="delta">{delta}</div>
                                <div className="percentage">
                                    <img src={percentage > 0 ? arrowUp : arrowDown} className="stock-arrow" draggable="false" />
                                    {percentage}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hover-area"></div>
            </div>
        );
    }
}

Favourite.propTypes = {
    stockCode: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    bindings: PropTypes.shape({
        dnd: PropTypes.shape({
            onDragStart: PropTypes.func.isRequired,
            onDragEnter: PropTypes.func.isRequired,
            onDrop: PropTypes.func.isRequired
        }).isRequired,
        onClick: PropTypes.func.isRequired,
        onIconClick: PropTypes.func.isRequired,
        onQuandlResponse: PropTypes.func.isRequired,
        onDoubleClick: PropTypes.func.isRequired
    }).isRequired,
    isFavourite: PropTypes.bool.isRequired
};

export default Favourite;
