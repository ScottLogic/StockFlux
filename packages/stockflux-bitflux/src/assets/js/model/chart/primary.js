import candlestickSeries from '../../series/candlestick';
import option from '../menu/option';
import util from '../../util/util';

export default function(initialProduct, initialDiscontinuityProvider) {
  var model = {
    data: [],
    visibleData: [],
    trackingLatest: true,
    viewDomain: [],
    selectorsChanged: true,
    discontinuityProvider: initialDiscontinuityProvider
  };

  var _product = initialProduct;
  Object.defineProperty(model, 'product', {
    get: function() {
      return _product;
    },
    set: function(newValue) {
      _product = newValue;
      model.selectorsChanged = true;
    }
  });

  var candlestick = candlestickSeries();
  candlestick.id = util.uid();
  var _series = option('Candlestick', 'candlestick', candlestick);
  _series.option.extentAccessor = ['high', 'low'];
  Object.defineProperty(model, 'series', {
    get: function() {
      return _series;
    },
    set: function(newValue) {
      _series = newValue;
      model.selectorsChanged = true;
    }
  });

  var _yValueAccessor = {
    option: function(d) {
      return d.close;
    }
  };
  Object.defineProperty(model, 'yValueAccessor', {
    get: function() {
      return _yValueAccessor;
    },
    set: function(newValue) {
      _yValueAccessor = newValue;
      model.selectorsChanged = true;
    }
  });

  var _indicators = [];
  Object.defineProperty(model, 'indicators', {
    get: function() {
      return _indicators;
    },
    set: function(newValue) {
      _indicators = newValue;
      model.selectorsChanged = true;
    }
  });

  return model;
}
