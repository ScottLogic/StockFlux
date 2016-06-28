import { expect } from 'chai';
import sinon from 'sinon';
import nock from 'nock';
import { search, getStockMetadata, getStockData, apiKey } from '../../../../src/child/services/QuandlService';
import createFakeQuandlServer from '../../../helper/fakeQuandlServer';

describe('child/services/QuandlService', () => {
    let clock;
    before(() => {
        createFakeQuandlServer(apiKey());
        clock = sinon.useFakeTimers(new Date(2016, 5, 1).getTime());
    });

    after(() => {
        nock.cleanAll();
        clock.restore();
    });

    describe('search', () => {
        it('should return search results when using an API key', () =>
            search('GOOG').then(response => {
                expect(response.length).to.equal(2);
                expect(response[0].code).to.equal('GOOG');
                expect(response[0].name).to.equal('Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume');
                expect(response[1].code).to.equal('GOOGL');
                expect(response[1].name).to.equal('Alphabet Inc (GOOGL) Prices, Dividends, Splits and Trading Volume');
            })
        );

        it('should return search results when falling back to using no API key', () =>
            search('GOOG', true).then(response => {
                expect(response.length).to.equal(2);
                expect(response[0].code).to.equal('GOOG');
                expect(response[0].name).to.equal('Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume');
                expect(response[1].code).to.equal('GOOGL');
                expect(response[1].name).to.equal('Alphabet Inc (GOOGL) Prices, Dividends, Splits and Trading Volume');
            })
        );

        it('should catch errors when using an API key', () =>
            search('BAD').catch(error => {
                expect(error.quandl_error.code).to.equal('QEAx01');
                expect(error.quandl_error.message).to.equal('Quandl error message description.');
            })
        );

        it('should catch errors when falling back to using no API key', () =>
            search('BAD', true).catch(error => {
                expect(error.quandl_error.code).to.equal('QEAx01');
                expect(error.quandl_error.message).to.equal('Quandl error message description.');
            })
        );
    });

    describe('getStockMetadata', () => {
        it('should return stock metadata', () =>
            getStockMetadata('GOOG').then(response => {
                expect(response.dataset.dataset_code).to.equal('GOOG');
                expect(response.dataset.name).to.equal('Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume');
            })
        );

        it('should catch errors', () =>
            getStockMetadata('BAD').catch(error => {
                expect(error.quandl_error.code).to.equal('QEAx01');
                expect(error.quandl_error.message).to.equal('Quandl error message description.');
            })
        );
    });

    describe('getStockData', () => {
        it('should return stock data when using an API key', () =>
            getStockData('GOOG').then(response => {
                expect(response.dataset.dataset_code).to.equal('GOOG');
                expect(response.dataset.name).to.equal('Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume');

                expect(response.stockData).to.be.an('object');
                expect(response.stockData.startDate).not.to.be.undefined;
                expect(response.stockData.endDate).not.to.be.undefined;
                expect(response.stockData.data).to.be.an('array');
            })
        );

        it('should return stock data when falling back to using no API key', () =>
            getStockData('GOOG', true).then(response => {
                expect(response.dataset.dataset_code).to.equal('GOOG');
                expect(response.dataset.name).to.equal('Alphabet Inc (GOOG) Prices, Dividends, Splits and Trading Volume');

                expect(response.stockData).to.be.an('object');
                expect(response.stockData.startDate).not.to.be.undefined;
                expect(response.stockData.endDate).not.to.be.undefined;
                expect(response.stockData.data).to.be.an('array');
            })
        );

        it('should catch errors when using an API key', () =>
            getStockData('BAD').catch(error => {
                expect(error.quandl_error.code).to.equal('QEAx01');
                expect(error.quandl_error.message).to.equal('Quandl error message description.');
            })
        );

        it('should catch errors when falling back to using no API key', () =>
            getStockData('BAD', true).catch(error => {
                expect(error.quandl_error.code).to.equal('QEAx01');
                expect(error.quandl_error.message).to.equal('Quandl error message description.');
            })
        );
    });

    describe('apiKey', () => {
        it('should return a string', () => {
            expect(apiKey()).to.be.a.string;
        });

        it('should return a string of length 20', () => {
            expect(apiKey()).to.have.lengthOf(20);
        });

        it('should return the correct value', () => {
            expect(apiKey()).to.equal('kM9Z9aEULVDD7svZ4A8B');
        });
    });
});
