import d3 from 'd3';

export default function() {
  var date = function(d) {
    return d.date;
  };
  var volume = function(d) {
    return Number(d.volume);
  };
  var price = function(d) {
    return Number(d.price);
  };
  var granularity = 60;

  function getBucketStart(tradeDate) {
    var granularityInMs = granularity * 1000;
    return new Date(
      Math.floor(tradeDate.getTime() / granularityInMs) * granularityInMs
    );
  }

  var collectOhlc = function(data, trade) {
    var bucketStart = getBucketStart(date(trade));
    var tradePrice = price(trade);
    var tradeVolume = volume(trade);
    var bisectDate = d3.bisector(function(d) {
      return d.date;
    }).left;
    var existing = data.filter(function(d) {
      return d.date.getTime() === bucketStart.getTime();
    })[0];
    if (existing) {
      existing.high = Math.max(tradePrice, existing.high);
      existing.low = Math.min(tradePrice, existing.low);
      existing.close = tradePrice;
      existing.volume += tradeVolume;
    } else {
      data.splice(bisectDate(data, bucketStart), 0, {
        date: bucketStart,
        open: tradePrice,
        high: tradePrice,
        low: tradePrice,
        close: tradePrice,
        volume: tradeVolume
      });
    }
  };

  collectOhlc.granularity = function(x) {
    if (!arguments.length) {
      return granularity;
    }
    granularity = x;
    return collectOhlc;
  };

  collectOhlc.price = function(x) {
    if (!arguments.length) {
      return price;
    }
    price = x;
    return collectOhlc;
  };

  collectOhlc.volume = function(x) {
    if (!arguments.length) {
      return volume;
    }
    volume = x;
    return collectOhlc;
  };

  collectOhlc.date = function(x) {
    if (!arguments.length) {
      return date;
    }
    date = x;
    return collectOhlc;
  };

  return collectOhlc;
}
