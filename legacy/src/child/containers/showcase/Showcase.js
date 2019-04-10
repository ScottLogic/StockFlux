import React, { Component, PropTypes } from 'react';
import bitflux from 'BitFlux/dist/bitflux';
import { apiKey as quandlServiceApiKey, dataset as quandlServiceDataset } from '../../services/QuandlService';
import configService from '../../../shared/ConfigService';

const columnNameMap = {
    Open: 'unadjustedOpen',
    High: 'unadjustedHigh',
    Low: 'unadjustedLow',
    Close: 'unadjustedClose',
    Volume: 'unadjustedVolume',
    Adj_Open: 'open',
    Adj_High: 'high',
    Adj_Low: 'low',
    Adj_Close: 'close',
    Adj_Volume: 'volume'
};

function mapColumnNames(colName) {
    let mappedName = columnNameMap[colName];
    if (!mappedName) {
        mappedName = colName[0].toLowerCase() + colName.substr(1);
    }
    return mappedName;
}

class Showcase extends Component {

    componentDidMount() {

        this.chart = bitflux
            .app()
            .quandlDatabase(quandlServiceDataset())
            .quandlColumnNameMap(mapColumnNames)
            .quandlApiKey(quandlServiceApiKey());

        this.chart.periodsOfDataToFetch(configService.getBitfluxStockAmount());
        this.chart.proportionOfDataToDisplayByDefault(configService.getInitialBitfluxProportion());

        // If there's already a selection, run the chart and use that.
        // This occurs when the user selects a stock in compact view
        // and it expands.
        this.firstRun = false;

        if (this.props.code) {
            this.firstRun = true;
            this.chart.run(this.showcaseContainer);
            // Added to make sure correct data on startup is displayed
            this.chart.changeQuandlProduct(this.props.code);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.code !== nextProps.code && nextProps.code) {
            if (!this.firstRun) {
                this.firstRun = true;
                this.chart.run(this.showcaseContainer);
            }
            this.chart.changeQuandlProduct(nextProps.code);
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <div ref={(ref) => { this.showcaseContainer = ref; }} id="showcase-container" />;
    }
}

Showcase.propTypes = {
    code: PropTypes.string
};

export default Showcase;
