import webSocketCloseEventFormatter from '../../common/webSocket/closeEventFormatter';

export default function(event) {
  var message;
  if (event.type === 'error' && event.message) {
    message = 'Live stream error: ' + event.message;
  } else if (event.type === 'close') {
    // The WebSocket's error event doesn't contain much useful information,
    // so the close event is used to report errors instead
    message = webSocketCloseEventFormatter(event);
  }
  return message;
}
