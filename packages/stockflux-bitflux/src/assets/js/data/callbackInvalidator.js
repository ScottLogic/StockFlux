export default function() {
  var n = 0;

  function callbackInvalidator(callback) {
    var id = ++n;
    return function(err, data) {
      if (id < n) {
        return;
      }
      callback(err, data);
    };
  }

  callbackInvalidator.invalidateCallback = function() {
    n++;
    return callbackInvalidator;
  };

  return callbackInvalidator;
}
