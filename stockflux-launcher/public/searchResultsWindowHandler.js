const onChange = searchInput => {
  // eslint-disable-next-line no-undef
  fin.InterApplicationBus.publish('search-request', searchInput);
};
