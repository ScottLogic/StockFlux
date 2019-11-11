import d3 from 'd3';
import callbackInvalidator from './callbackInvalidator';
import collectOhlc from './collectOhlc';
import event from '../event';

export default function() {
  var dispatch = d3.dispatch(
    event.newTrade,
    event.historicDataLoaded,
    event.historicFeedError,
    event.streamingFeedError,
    event.streamingFeedClose
  );

  var _collectOhlc = collectOhlc()
    .date(function(d) {
      return new Date(d.time);
    })
    .volume(function(d) {
      return Number(d.size);
    });

  var source,
    callbackGenerator = callbackInvalidator(),
    candlesOfData = 200,
    data = [];

  function invalidate() {
    if (source && source.streamingFeed) {
      source.streamingFeed.close();
    }
    data = [];
    callbackGenerator.invalidateCallback();
  }

  function dateSortAscending(dataToSort) {
    return dataToSort.sort(function(a, b) {
      return a.date - b.date;
    });
  }

  function handleStreamingFeedEvents() {
    if (source.streamingFeed != null) {
      source.streamingFeed
        .on('message', function(trade) {
          _collectOhlc(data, trade);
          dispatch[event.newTrade](data, source);
        })
        .on('error', function(streamingFeedError) {
          dispatch[event.streamingFeedError](streamingFeedError, source);
        })
        .on('close', function(closeEvent) {
          dispatch[event.streamingFeedClose](closeEvent, source);
        });
      source.streamingFeed();
    }
  }

  function dataInterface(granularity, product) {
    invalidate();

    if (arguments.length === 2) {
      source = product.source;
      source.historicFeed.product(product.id);

      if (source.streamingFeed != null) {
        source.streamingFeed.product(product.id);
      }
    }

    var now = new Date();

    source.historicFeed
      .end(now)
      .candles(candlesOfData)
      .granularity(granularity);

    _collectOhlc.granularity(granularity);

    source.historicFeed(
      callbackGenerator(function(historicFeedError, newData) {
        if (!historicFeedError) {
          data = dateSortAscending(newData);
          dispatch[event.historicDataLoaded](data, source);
          handleStreamingFeedEvents();
        } else {
          dispatch[event.historicFeedError](historicFeedError, source);
        }
      })
    );
  }

  dataInterface.candlesOfData = function(x) {
    if (!arguments.length) {
      return candlesOfData;
    }
    candlesOfData = x;
    return dataInterface;
  };

  d3.rebind(dataInterface, dispatch, 'on');

  return dataInterface;
}
