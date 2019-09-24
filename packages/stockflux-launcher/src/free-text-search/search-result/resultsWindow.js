import React from 'react';

const ResultsWindow = () => {
  document.addEventListener('click', event => {
      const button = event.target.closest('.buttonAction');
    
      if (button) {
        const searchResult = button.closest('.searchResult');
        const type = button.classList.contains('newsView')
          ? 'news-view'
          : button.classList.contains('watchlistAdd')
          ? 'watchlist-add'
          : 'chart-add';
    
        window.fin.InterApplicationBus.send(
          { uuid: window.fin.Window.me.uuid },
          'intent-request',
          {
            symbol: searchResult.children[1].textContent,
            name: searchResult.children[0].textContent,
            type
          }
        );
      }
  return (
        <div id="container">
          <div id="searchbar-container" class="free-text-search" hidden>
            <input
              type="text"
              oninput="onChange(this.value)"
              placeholder="Search"
            />
          </div>
          <div id="results-container">
            <p>Use the input field above to search for instruments.</p>
          </div>
        </div>
    
    )
}
