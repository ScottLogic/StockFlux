export default function(event) {
  var message;
  if (event.wasClean === false && event.code !== 1000 && event.code !== 1006) {
    var reason = event.reason || 'Unkown reason.';
    message = 'Disconnected from live stream: ' + event.code + ' ' + reason;
  }
  return message;
}
