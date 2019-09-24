document.addEventListener('click', event => {
  const button = event.target.closest('.buttonAction');

  if (button) {
    const searchResult = button.closest('.searchResult');
    const type = button.classList.remove('round', 'shortcut', 'small');
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
});
