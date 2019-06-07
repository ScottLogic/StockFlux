const onChange = searchInput => window.fin.InterApplicationBus.publish('search-request', searchInput);

document.addEventListener('click', (event) => {
    const button = event.target.closest('.buttonAction');

    if (button) {
        const searchResult = button.closest('.searchResult');
        const type = button.classList.contains("newsView") ? 'news-view' :
            button.classList.contains("watchlistAdd") ? 'watchlist-add' : 'chart-add';

        window.fin.InterApplicationBus.send({ uuid: window.fin.Window.me.uuid }, 'intent-request', {
            code: searchResult.children[1].textContent,
            name: searchResult.children[0].textContent,
            type
        })
    }
});
