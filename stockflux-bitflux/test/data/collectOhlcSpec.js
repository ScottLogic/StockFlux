import collectOhlc from '../../src/assets/js/data/collectOhlc';

describe('data/collectOhlc', function() {

    var _collectOhlc = collectOhlc()
        .date(function(d) { return d.date; })
        .volume(function(d) { return Number(d.volume); })
        .price(function(d) { return Number(d.price); })
        .granularity(60);

    it('should update bucket with new trade if bucket exists', function() {
        var date = new Date(2015, 11, 25);
        var data = [{
            date: date,
            open: 10,
            high: 10,
            low: 10,
            close: 10,
            volume: 10
        }];
        var trade = {
            date: date,
            volume: 10,
            price: 15
        };
        _collectOhlc(data, trade);
        expect(data).toEqual([{
            date: date,
            open: 10,
            high: 15,
            low: 10,
            close: 15,
            volume: 20
        }]);
    });

    it('should add new bucket if bucket does not exist', function() {
        var tradeDate = new Date(2015, 11, 26);
        var data = [];
        var trade = {
            date: tradeDate,
            volume: 10,
            price: 15
        };
        _collectOhlc(data, trade);
        expect(data.length).toEqual(1);
        expect(data[0]).toEqual({
            date: tradeDate,
            open: trade.price,
            high: trade.price,
            low: trade.price,
            close: trade.price,
            volume: trade.volume
        });
    });

    it('should maintain date sorted order for new buckets', function() {
        var data = [{
            date: new Date(2015, 11, 25)
        }, {
            date: new Date(2015, 11, 27)
        }];
        var trade = {
            date: new Date(2015, 11, 26),
            volume: 10,
            price: 15
        };
        _collectOhlc(data, trade);
        expect(data.length).toEqual(3);
        expect(data[1].date.getTime()).toEqual(trade.date.getTime());
    });
});
