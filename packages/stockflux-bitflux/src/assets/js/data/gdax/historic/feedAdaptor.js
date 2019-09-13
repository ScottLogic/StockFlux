import d3 from 'd3';
import { feedGdax } from 'd3fc-financial-feed';
import debounce from '../../../util/debounce';

export default function() {
    var rateLimit = 1000;       // The GDAX API has a limit of 1 request per second

    var historicFeed = feedGdax(),
        candles;

    var gdaxAdaptor = debounce(function gdaxAdaptor(cb) {
        var startDate = d3.time.second.offset(historicFeed.end(), -candles * historicFeed.granularity());
        historicFeed.start(startDate);
        historicFeed(cb);
    }, rateLimit);

    gdaxAdaptor.candles = function(x) {
        if (!arguments.length) {
            return candles;
        }
        candles = x;
        return gdaxAdaptor;
    };

    gdaxAdaptor.apiKey = function() {
        throw new Error('Not implemented.');
    };

    gdaxAdaptor.database = function() {
        throw new Error('Not implemented.');
    };

    gdaxAdaptor.columnNameMap = function() {
        throw new Error('Not implemented.');
    };

    d3.rebind(gdaxAdaptor, historicFeed, 'end', 'granularity', 'product');

    return gdaxAdaptor;
}
