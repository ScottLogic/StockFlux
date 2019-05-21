function onNotificationMessage(message) {
  document.getElementById('symbol').innerHTML = message.symbol;
  document.getElementById('message').innerHTML = message.messageText;
}
