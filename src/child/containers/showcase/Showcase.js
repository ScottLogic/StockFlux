import React, { Component, PropTypes } from 'react';
import QuandlService from '../../services/QuandlService';
import configService from '../../../shared/ConfigService';

class Showcase extends Component {

    componentDidMount() {

        const quandlService = new QuandlService();
        this.chart = bitflux.app().quandlApiKey(quandlService.apiKey());

        this.chart.periodsOfDataToFetch(configService.getBitfluxStockAmount());
        this.chart.proportionOfDataToDisplayByDefault(configService.getInitialBitfluxProportion());

        // If there's already a selection, run the chart and use that.
        // This occurs when the user selects a stock in compact view
        // and it expands.
        this.firstRun = false;

        if (this.props.code) {
            this.firstRun = true;
            this.chart.run(this.refs.chart);
            // Added to make sure correct data on startup is displayed
            this.chart.changeQuandlProduct(this.props.code);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.code !== nextProps.code && nextProps.code) {
            if (!this.firstRun) {
                this.firstRun = true;
                this.chart.run(this.refs.chart);
            }
            this.chart.changeQuandlProduct(nextProps.code);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div ref="chart" id="showcase-container"></div>
        );
    }
}

Showcase.propTypes = {
    code: PropTypes.string
};

export default Showcase;
