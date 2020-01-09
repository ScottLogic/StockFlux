import getPosition from './Positioner';

export default (name, bounds, dockedTo, dockSelectorButton, size) => {
  const { defaultHeight, defaultWidth } =
    dockedTo === 'right' || dockedTo === 'left'
      ? { defaultHeight: size.defaultHeight, defaultWidth: 0 }
      : { defaultHeight: 0, defaultWidth: size.defaultWidth };
  const { defaultTop, defaultLeft } = getPosition(
    dockSelectorButton,
    dockedTo,
    bounds,
    defaultHeight,
    defaultWidth
  );

  return {
    name: name,
    url: 'child-window.html',
    frame: false,
    autoShow: true,
    defaultTop,
    defaultLeft,
    defaultWidth,
    defaultHeight,
    saveWindowState: false,
    showTaskbarIcon: false,
    backgroundColor: '#071521',
    waitForPageLoad: true,
    alwaysOnTop: true,
    resizable: false,
    cornerRounding: {
      width: 3,
      height: 3
    }
  };
};
