import { OpenfinApiHelpers } from 'stockflux-core';

async function getBounds() {
  let bounds = await OpenfinApiHelpers.getCurrentWindowSync().getBounds();
  return bounds;
}

async function getMonitorInfo() {
  let monitorInfo = await window.fin.System.getMonitorInfo();
  return monitorInfo;
}

function boundsCheck(bounds, screen, primaryCheck) {
  if (primaryCheck) {
    const lInBounds = bounds.left >= screen.left && bounds.left < screen.right;
    const tInBounds = bounds.top >= screen.top && bounds.top < screen.bottom;

    return lInBounds && tInBounds;
  } else {
    const rInBounds =
      bounds.right >= screen.left && bounds.right < screen.right;
    const bInBounds =
      bounds.bottom >= screen.top && bounds.bottom < screen.bottom;

    return rInBounds && bInBounds;
  }
}

function getMiddleScreenPosition(screen) {
  let amount = screen.left + screen.right;
  let midpoint = amount / 2;
  return midpoint - 362;
}

function getLeftPosition(
  bounds,
  primaryMonitorRect,
  nonPrimaryMonitors,
  isInMonitorBool,
  left,
  normalBounds
) {
  isInMonitorBool = boundsCheck(bounds, primaryMonitorRect, normalBounds);
  left = bounds.left;

  if (isInMonitorBool) {
    left = getMiddleScreenPosition(primaryMonitorRect);
  } else {
    do {
      for (const nonPrimaryMonitor of nonPrimaryMonitors) {
        isInMonitorBool = boundsCheck(
          bounds,
          nonPrimaryMonitor.monitorRect,
          normalBounds
        );
        if (isInMonitorBool)
          left = getMiddleScreenPosition(nonPrimaryMonitor.monitorRect);
      }
      if (!isInMonitorBool) break;
    } while (!isInMonitorBool);
  }

  return { isInMonitorBool, left };
}

export default () => {
  return getBounds().then(bounds => {
    return getMonitorInfo().then(monitor => {
      const nonPrimaryMonitors = monitor.nonPrimaryMonitors;
      const primaryMonitorRect = monitor.primaryMonitor.monitorRect;

      let isInMonitorBool = false;
      let left = bounds.left;

      // Check if launcher is in window using left/top checks
      let resultNormalBounds = getLeftPosition(
        bounds,
        primaryMonitorRect,
        nonPrimaryMonitors,
        isInMonitorBool,
        left,
        true
      );

      if (resultNormalBounds.isInMonitorBool) {
        return { left: resultNormalBounds.left, top: bounds.top };
      }

      // Check if launcher is in window using right/bottom checks
      let nonNormalBounds = getLeftPosition(
        bounds,
        primaryMonitorRect,
        nonPrimaryMonitors,
        isInMonitorBool,
        left,
        false
      );

      return { left: nonNormalBounds.left, top: bounds.top };
    });
  });
};
