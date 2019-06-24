// eslint-disable-next-line no-unused-vars
function onNotificationMessage(message) {
  document.getElementById('symbol').innerHTML = message.symbol;
  document.getElementById('message').innerHTML = message.messageText;
  document.getElementById('watchlist-name').innerHTML = message.watchlistName
    ? ' ' + message.watchlistName + ' '
    : ' ';
  const imageSrc = message.alreadyInWatchlist ? 'ArrowUp.png' : 'CardIcon.png';
  const image = document.getElementById('icon');
  image.src = imageSrc;
  image.className = message.alreadyInWatchlist ? 'arrow-up' : 'card-icon';
}
