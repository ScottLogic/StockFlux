import d3 from 'd3';
import fc from 'd3fc';
import model from './model/model';
import chart from './chart/chart';
import util from './util/util';
import candlestickSeries from './series/candlestick';
import dataGeneratorAdaptor from './data/generator/historic/feedAdaptor';
import gdaxAdaptor from './data/gdax/historic/feedAdaptor';
import gdaxHistoricErrorResponseFormatter from './data/gdax/historic/errorResponseFormatter';
import gdaxWebSocket from './data/gdax/streaming/webSocket';
import gdaxStreamingErrorResponseFormatter from './data/gdax/streaming/errorResponseFormatter';
import quandlAdaptor from './data/quandl/historic/feedAdaptor';
import quandlHistoricErrorResponseFormatter from './data/quandl/historic/errorResponseFormatter';
import stockFluxAdaptor from './data/stockflux/historic/feedAdaptor';
import stockFluxErrorResponseFormatter from './data/stockflux/historic/errorResponseFormatter';
import skipWeekendsDiscontinuityProvider from './scale/discontinuity/skipWeekends';

export default function() {
    function initialisePeriods() {
        return {
            week1: model.data.period('Weekly', 60 * 60 * 24 * 7, {unit: d3.time.week, value: 1}, '%b %d'),
            day1: model.data.period('Daily', 60 * 60 * 24, {unit: d3.time.day, value: 1}, '%b %d'),
            hour1: model.data.period('1 Hr', 60 * 60, {unit: d3.time.hour, value: 1}, '%b %d %Hh'),
            minute5: model.data.period('5 Min', 60 * 5, {unit: d3.time.minute, value: 5}, '%H:%M'),
            minute1: model.data.period('1 Min', 60, {unit: d3.time.minute, value: 1}, '%H:%M')
        };
    }

    function initialiseSources() {
        return {
            generated: model.data.source(
                dataGeneratorAdaptor(),
                null,
                null,
                null,
                fc.scale.discontinuity.identity()),
            bitcoin: model.data.source(
                gdaxAdaptor(),
                gdaxHistoricErrorResponseFormatter,
                gdaxWebSocket(),
                gdaxStreamingErrorResponseFormatter,
                fc.scale.discontinuity.identity()),
            quandl: model.data.source(
                quandlAdaptor(),
                quandlHistoricErrorResponseFormatter,
                null,
                null,
                skipWeekendsDiscontinuityProvider()),
            stockFlux: model.data.source(
                stockFluxAdaptor(),
                stockFluxErrorResponseFormatter,
                null,
                null,
                fc.scale.discontinuity.identity()
            )
        };
    }

    function initialiseProducts() {
        return {
            generated: model.data.product('Data Generator', 'Data Generator', [periods.day1], sources.generated, '.3s'),
            quandl: model.data.product('GOOG', 'GOOG', [periods.day1], sources.quandl, '.3s'),
            stockFlux: model.data.product('AAPL', 'AAPL', [periods.day1], sources.stockFlux, '.3s')
        };
    }

    function initialiseSeriesSelector() {

        var candlestick = candlestickSeries();
        candlestick.id = util.uid();
        var candlestickOption = model.menu.option(
            'Candlestick',
            'candlestick',
            candlestick,
            'bf-icon-candlestick-series');
        candlestickOption.isSelected = true;
        candlestickOption.option.extentAccessor = ['high', 'low'];

        var ohlc = fc.series.ohlc();
        ohlc.id = util.uid();
        var ohlcOption = model.menu.option('OHLC', 'ohlc', ohlc, 'bf-icon-ohlc-series');
        ohlcOption.option.extentAccessor = ['high', 'low'];

        var line = fc.series.line()
            .xValue(function(d) { return d.date; });
        line.id = util.uid();
        var lineOption = model.menu.option('Line', 'line', line, 'bf-icon-line-series');
        lineOption.option.extentAccessor = 'close';

        var point = fc.series.point()
            .xValue(function(d) { return d.date; });
        point.id = util.uid();
        var pointOption = model.menu.option('Point', 'point', point, 'bf-icon-point-series');
        pointOption.option.extentAccessor = 'close';

        var area = fc.series.area()
            .xValue(function(d) { return d.date; });
        area.id = util.uid();
        var areaOption = model.menu.option('Area', 'area', area, 'bf-icon-area-series');
        areaOption.option.extentAccessor = 'close';

        var config = model.menu.dropdownConfig(null, false, true, true);

        var options = [
            candlestickOption,
            ohlcOption,
            lineOption,
            pointOption,
            areaOption
        ];

        return model.menu.selector(config, options);
    }

    function initialiseIndicatorOptions() {
        var secondary = chart.secondary;

        var movingAverage = fc.series.line()
            .decorate(function(select) {
                select.enter()
                    .classed('movingAverage', true);
            })
            .xValue(function(d) { return d.date; })
            .yValue(function(d) { return d.movingAverage; });
        movingAverage.id = util.uid();

        var movingAverageOption = model.menu.option('Moving Average', 'movingAverage',
            movingAverage, 'bf-icon-moving-average-indicator', true);
        movingAverageOption.option.extentAccessor = function(d) { return d.movingAverage; };

        var bollingerBands = fc.indicator.renderer.bollingerBands();
        bollingerBands.id = util.uid();

        var bollingerBandsOption = model.menu.option('Bollinger Bands', 'bollinger',
            bollingerBands, 'bf-icon-bollinger-bands-indicator', true);
        bollingerBandsOption.option.extentAccessor = [function(d) { return d.bollingerBands.lower; },
            function(d) { return d.bollingerBands.upper; }];

        var rsi = secondary.rsi();
        rsi.id = util.uid();

        var macd = secondary.macd();
        macd.id = util.uid();

        var volume = secondary.volume();
        volume.id = util.uid();

        var indicators = [
            movingAverageOption,
            bollingerBandsOption,
            model.menu.option('Relative Strength Index', 'rsi',
                rsi, 'bf-icon-rsi-indicator', false),
            model.menu.option('MACD', 'macd',
                macd, 'bf-icon-macd-indicator', false),
            model.menu.option('Volume', 'volume',
                volume, 'bf-icon-bar-series', false)
        ];

        return indicators;
    }

    function initialiseIndicatorSelector() {
        var config = model.menu.dropdownConfig('Add Indicator', false, true);

        return model.menu.selector(config, initialiseIndicatorOptions());
    }

    function initialiseSelectors() {
        return {
            seriesSelector: initialiseSeriesSelector(),
            indicatorSelector: initialiseIndicatorSelector()
        };
    }

    function initialiseCharts() {
        var legend = model.chart.legend(products.generated, periods.day1);
        var nav = model.chart.nav(products.generated.source.discontinuityProvider);
        var primary = model.chart.primary(products.generated, products.generated.source.discontinuityProvider);
        var secondary = model.chart.secondary(products.generated, products.generated.source.discontinuityProvider);
        var xAxis = model.chart.xAxis(periods.day1, products.generated.source.discontinuityProvider);

        return model.chart.group(legend, nav, primary, secondary, xAxis);
    }

    var periods = initialisePeriods();
    var sources = initialiseSources();
    var products = initialiseProducts();

    return {
        data: [],
        periods: periods,
        sources: sources,
        selectors: initialiseSelectors(),
        navReset: model.chart.navigationReset(),
        headMenu: model.menu.head([ products.stockFlux, products.generated, products.quandl], products.generated, periods.day1),
        overlay: model.menu.overlay([ products.stockFlux, products.generated, products.quandl], products.generated),
        notificationMessages: model.notification.messages(),
        charts: initialiseCharts()
    };
}
