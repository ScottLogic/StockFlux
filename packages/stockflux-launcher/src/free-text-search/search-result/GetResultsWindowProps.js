export default ({ defaultTop, defaultLeft, defaultWidth, defaultHeight }) => ({
  name: 'search-results',
  defaultWidth,
  defaultHeight,
  url: 'child-window.html',
  frame: false,
  autoShow: true,
  defaultTop,
  defaultLeft,
  saveWindowState: false,
  showTaskbarIcon: false,
  backgroundColor: '#28313D',
  waitForPageLoad: true,
  alwaysOnTop: false,
  maxWidth: 400,
  minWidth: 400,
  minHeight: 300
});
