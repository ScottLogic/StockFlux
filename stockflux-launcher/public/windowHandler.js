const onChange = searchInput => {
  // eslint-disable-next-line no-undef
  fin.desktop.InterApplicationBus.publish('search-request', searchInput);
};
