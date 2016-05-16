import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { truncate } from '../services/formatters';
import Minichart from './minichart/Minichart.js';
import QuandlService from '../services/QuandlService.js';
const quandlService = new QuandlService();

import arrowUp from '../assets/png/arrow_up.png';
import arrowDown from '../assets/png/arrow_down.png';


class Favourite extends Component {

    constructor(props) {
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
    }

    componentDidMount() {
        const stockCode = this.props.stockCode;
        quandlService.getStockData(stockCode, response => {
            const data = response.stockData.data[0];
            const stockData = {
                name: response.dataset.name,
                price: data.close,
                delta: data.close - data.open,
                percentage: (data.close - data.open) / data.open * 100
            };
            const chartData = response;
            this.props.bindings.onQuandlResponse(stockCode, response.dataset.name);
            this.setState({ stockData, chartData });
        });
    }

    onIconClick(e) {
        e.stopPropagation();
        this.props.bindings.onIconClick(this.props.stockCode);
    }

    render() {
        const { stockCode, selected, bindings } = this.props;

        let { stockData, chartData } = this.state || {};
        stockData = stockData || {};

        const cls = classNames({
            selected,
            dark: selected
        });

        const price = !isNaN(+stockData.price) ? (+stockData.price).toFixed(2) : '';
        const delta = !isNaN(+stockData.delta) ? (+stockData.delta).toFixed(2) : '';
        const percentage = !isNaN(+stockData.percentage) ? Math.abs((+stockData.percentage)).toFixed(2) : '';
        const name = stockData.name ? truncate(stockData.name) : '';

        return (
            <div>
                <div className="drop-target">
                    <div className={`darkens favourite tearable ${cls}`} onClick={() => bindings.onClick(stockCode, name)} ng-dblclick="doubleClick(stock)" draggable="false">
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

// onClick: PropTypes.func.isRequired,
Favourite.propTypes = {
    stockCode: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    bindings: PropTypes.object.isRequired,
    isFavourite: PropTypes.bool.isRequired
};

export default Favourite;
