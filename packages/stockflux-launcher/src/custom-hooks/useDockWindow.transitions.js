const ANIMATION_DURATION = 250;
const UNDOCK_MARGIN = 25;

const stretchedUndock = (previous, monitorBounds, stretchToFit, options) => {
  const width =
    options && options.undockSize
      ? options.undockSize.width
      : previous === 'top' || previous === 'bottom'
      ? monitorBounds.right - monitorBounds.left - UNDOCK_MARGIN * 2
      : stretchToFit.dockedWidth;
  const height =
    options && options.undockSize
      ? options.undockSize.height
      : previous === 'left' || previous === 'right'
      ? monitorBounds.bottom - monitorBounds.top - UNDOCK_MARGIN * 2
      : stretchToFit.dockedHeight;
  const top =
    options && options.undockPosition
      ? options.undockPosition.top
      : previous !== 'bottom'
      ? monitorBounds.top + UNDOCK_MARGIN
      : monitorBounds.bottom - height - UNDOCK_MARGIN;
  const left =
    options && options.undockPosition
      ? options.undockPosition.left
      : previous !== 'right'
      ? monitorBounds.left + UNDOCK_MARGIN
      : monitorBounds.right - width - UNDOCK_MARGIN;

  return {
    position: {
      duration: ANIMATION_DURATION,
      left,
      relative: false,
      top
    },
    size: {
      duration: ANIMATION_DURATION,
      height,
      relative: false,
      width
    }
  };
};

const undock = (previous, windowBounds, options) => {
  const width =
    options && options.undockSize
      ? options.undockSize.width
      : windowBounds.width;
  const height =
    options && options.undockSize
      ? options.undockSize.height
      : windowBounds.height;
  const top =
    options && options.undockPosition
      ? options.undockPosition.top
      : previous === 'top'
      ? windowBounds.top + UNDOCK_MARGIN
      : previous === 'bottom'
      ? windowBounds.top - UNDOCK_MARGIN
      : windowBounds.top;
  const left =
    options && options.undockPosition
      ? options.undockPosition.left
      : previous === 'left'
      ? windowBounds.left + UNDOCK_MARGIN
      : previous === 'right'
      ? windowBounds.left - UNDOCK_MARGIN
      : windowBounds.left;

  return {
    position: {
      duration: ANIMATION_DURATION,
      left,
      relative: false,
      top
    },
    size: {
      duration: ANIMATION_DURATION,
      height,
      relative: false,
      width
    }
  };
};

const stretchedDock = (current, monitorBounds, stretchToFit) => ({
  position: {
    duration: ANIMATION_DURATION,
    left:
      current !== 'right'
        ? monitorBounds.left
        : monitorBounds.right - stretchToFit.dockedWidth,
    relative: false,
    top:
      current !== 'bottom'
        ? monitorBounds.top
        : monitorBounds.bottom - stretchToFit.dockedHeight
  },
  size: {
    duration: ANIMATION_DURATION,
    height:
      current === 'top' || current === 'bottom'
        ? stretchToFit.dockedHeight
        : monitorBounds.bottom - monitorBounds.top,
    relative: false,
    width:
      current === 'top' || current === 'bottom'
        ? monitorBounds.right - monitorBounds.left
        : stretchToFit.dockedWidth
  }
});

const dock = (current, monitorBounds, windowBounds) => ({
  position: {
    duration: ANIMATION_DURATION,
    left:
      current === 'left'
        ? monitorBounds.left
        : current === 'right'
        ? monitorBounds.right - windowBounds.width
        : windowBounds.left,
    relative: false,
    top:
      current === 'top'
        ? monitorBounds.top
        : current === 'bottom'
        ? monitorBounds.bottom - windowBounds.height
        : windowBounds.top
  },
  size: {
    duration: ANIMATION_DURATION,
    height: windowBounds.height,
    relative: false,
    width: windowBounds.width
  }
});

export default {
  dock,
  stretchedDock,
  stretchedUndock,
  undock
};
