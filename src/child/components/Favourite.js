import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { truncate } from '../services/formatters';
import Minichart from './minichart/Minichart.js';
import QuandlService from '../services/QuandlService.js';
const quandlService = new QuandlService();

class Favourite extends Component {

    componentDidMount() {
        const stockCode = this.props.stockCode;
        quandlService.getStockData(stockCode, response => {
            const data = response.stockData.data[0];
            console.log('getStockData response ::: ', response);
            const stockData = {
                name: response.dataset.name,
                price: data.close,
                delta: data.close - data.open,
                percentage: (data.close - data.open) / data.open * 100
            };
            const chartData = response;
            this.setState({ stockData, chartData });
        });
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
        const percentage = !isNaN(+stockData.percentage) ? (+stockData.percentage).toFixed(2) : '';
        const name = stockData.name ? truncate(stockData.name) : '';

        // <div class="favourite darkens selection() !== stock.code ? '' : ' dark'}} tearable {{single()}}" ng-click="singleClick(stock)" ng-dblclick="doubleClick(stock)" draggable="false"
        return (
            <div>
                <div className="drop-target">
                    <div className={`darkens favourite tearable ${cls}`} onClick={() => bindings.onClick(stockCode, name)} ng-dblclick="doubleClick(stock)" draggable="false">
                        <div className="top">
                            <star stock="stock" confirm="true"></star>
                            <div className="name">{name}</div>
                            <div className="code">{stockCode.toUpperCase()}</div>
                        </div>
                        <div className="bottom">
                            <Minichart stockCode={stockCode} chartData={chartData} />
                            <div className="details">
                                <div className="price">{price}</div>
                                <div className="delta">{delta}</div>
                                <div className="percentage">
                                    <img ng-src="assets/png/{{icon(stock)}}.png" className="stock-arrow" draggable="false" />
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
