import getPosition from './Positioner';

export default (name, bounds, dockedTo, dockSelectorButton) => {
  const { defaultHeight, defaultWidth } =
    dockedTo === 'right' || dockedTo === 'left'
      ? { defaultHeight: 50, defaultWidth: 278 }
      : { defaultHeight: 150, defaultWidth: 96 };
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
