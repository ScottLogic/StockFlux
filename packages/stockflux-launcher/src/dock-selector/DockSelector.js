import cx from 'classnames';
import React, {
  useState,
  useReducer,
  useEffect,
  useRef,
  useCallback
} from 'react';
import Components from 'stockflux-components';
import { useChildWindow, useBounds } from 'openfin-react-hooks';
import './DockSelector.css';

const DOCK_SELECTOR_WINDOW_NAME = 'dockSelector';
const DOCK_SELECTOR_CSS_PATCH = 'dockSelector.css';

const DockSelector = ({ dockedTo, tools }) => {
  const [showSelector, setShowSelector] = useState(false);
  const childWindow = useChildWindow({
    name: DOCK_SELECTOR_WINDOW_NAME,
    parentDocument: document,
    cssUrl: DOCK_SELECTOR_CSS_PATCH,
    shouldInheritCss: true,
    shouldClosePreviousOnLaunch: true
  });
  const bounds = useBounds();

  const { windowRef, launch, populate, close } = childWindow;

  const launchChildWindow = useCallback(
    () =>
      launch(
        // getResultsWindowProps(
        //   DOCK_SELECTOR_WINDOW_NAME,
        //   searchButtonRef,
        //   dockedTo,
        //   bounds
        // )
      ),
    [bounds, dockedTo, launch]
  );

  return (
    <Components.Buttons.Round
      className="shortcut selectDock"
      onClick={() => setShowSelector(true)}
    >
      Show Thing
    </Components.Buttons.Round>
  );
};
export default DockSelector;
