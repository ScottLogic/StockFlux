import d3 from 'd3';
import formatProducts from '../../../src/assets/js/data/gdax/formatProducts';

var min1 = 60;
var min5 = 300;
var hr1 = 3600;
var day1 = 86400;
var defaultPeriods = [hr1, day1];
var productPeriodOverrides = d3.map();
productPeriodOverrides.set('BTC-USD', [min1, min5, hr1, day1]);

describe('data/gdax/formatProducts', function() {
    describe('product periods', function() {
        it('should assign the correct default periods if a product if not specified as an override', function() {
            var btcgbp = [{ id: 'BTC-GBP' }];
            var productResponse = formatProducts(btcgbp, null, defaultPeriods, productPeriodOverrides);
            expect(productResponse[0].periods.length).toEqual(2);
            expect(productResponse[0].periods[0]).toEqual(hr1);
            expect(productResponse[0].periods[1]).toEqual(day1);
        });

        it('should assign the correct periods to an overridden product', function() {
            var btcusd = [{ id: 'BTC-USD' }];
            var productResponse = formatProducts(btcusd, null, defaultPeriods, productPeriodOverrides);
            expect(productResponse[0].periods.length).toEqual(4);
            expect(productResponse[0].periods[0]).toEqual(min1);
            expect(productResponse[0].periods[1]).toEqual(min5);
            expect(productResponse[0].periods[2]).toEqual(hr1);
            expect(productResponse[0].periods[3]).toEqual(day1);
        });
    });
});
