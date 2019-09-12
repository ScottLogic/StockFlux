import d3 from 'd3';
import fc from 'd3fc';

export default function() {

    var dataGenerator = fc.data.random.financial(),
        allowedPeriods = [60 * 60 * 24],
        candles,
        end,
        granularity,
        product = null;

    var dataGeneratorAdaptor = function(cb) {
        end.setHours(0, 0, 0, 0);
        var startDate = d3.time.day.offset(end, -(candles - 1));
        dataGenerator.startDate(startDate);
        var data = dataGenerator(candles);
        cb(null, data);
    };

    dataGeneratorAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return dataGeneratorAdaptor;
    };

    dataGeneratorAdaptor.end = function(x) {
        if (!arguments.length) {
            return end;
        }
        end = x;
        return dataGeneratorAdaptor;
    };

    dataGeneratorAdaptor.granularity = function(x) {
        if (!arguments.length) {
            return granularity;
        }
        if (allowedPeriods.indexOf(x) === -1) {
            throw new Error('Granularity of ' + x + ' is not supported. '
             + 'Random Financial Data Generator only supports daily data.');
        }
        granularity = x;
        return dataGeneratorAdaptor;
    };

    dataGeneratorAdaptor.product = function(x) {
        if (!arguments.length) {
            return product;
        }
        if (x !== 'Data Generator') {
            throw new Error('Random Financial Data Generator does not support products.');
        }
        product = x;
        return dataGeneratorAdaptor;
    };

    dataGeneratorAdaptor.apiKey = function() {
        throw new Error('Not implemented.');
    };

    dataGeneratorAdaptor.database = function() {
        throw new Error('Not implemented.');
    };

    dataGeneratorAdaptor.columnNameMap = function() {
        throw new Error('Not implemented.');
    };

    return dataGeneratorAdaptor;
}
