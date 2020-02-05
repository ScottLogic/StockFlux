import React, { useState, useEffect, useCallback, useRef } from 'react';
import cx from 'classnames';
import Components from 'stockflux-components';
import { useChildWindow, useBounds } from 'openfin-react-hooks';
import GetSelectionWindowProps from './GetSelectionWindowProps';
import ToolBar from '../toolbar/ToolBar';
import './DockSelector.css';

const DOCK_SELECTOR_WINDOW_NAME = 'dockSelector';
const DOCK_SELECTOR_CSS_PATCH = 'dockSelector.css';

const DockSelector = ({ dockedTo, tools, iconStyle }) => {
  const [showSelector, setShowSelector] = useState(false);
  const childWindow = useChildWindow({
    name: DOCK_SELECTOR_WINDOW_NAME,
    parentDocument: document,
    cssUrl: DOCK_SELECTOR_CSS_PATCH,
    shouldInheritCss: true,
    shouldClosePreviousOnLaunch: true
  });
  const [bounds] = useBounds();
  const dockSelectorButton = useRef(null);

  const { windowRef, launch, populate, close } = childWindow;

  const { defaultHeight, defaultWidth } =
    dockedTo === 'right' || dockedTo === 'left'
      ? { defaultHeight: 50, defaultWidth: 278 }
      : { defaultHeight: 150, defaultWidth: 96 };

  const launchChildWindow = useCallback(
    () =>
      launch(
        GetSelectionWindowProps(
          DOCK_SELECTOR_WINDOW_NAME,
          bounds,
          dockedTo,
          dockSelectorButton,
          { defaultHeight, defaultWidth }
        )
      ),
    [launch, bounds, dockedTo, defaultHeight, defaultWidth]
  );

  useEffect(() => {
    if (showSelector) {
      launchChildWindow();
    } else {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSelector]);

  useEffect(() => {
    setShowSelector(false);
  }, [dockedTo]);

  useEffect(() => {
    if (windowRef) {
      const childWindowJsx = (
        <ToolBar
          tools={tools}
          dockedTo={dockedTo}
          style={
            dockedTo === 'top' || dockedTo === 'none'
              ? 'dropdown dropdown-vertical'
              : 'dropdown dropdown-horizontal'
          }
        ></ToolBar>
      );
      populate(childWindowJsx);
    }
  }, [windowRef, tools, populate, dockedTo]);

  useEffect(() => {
    if (windowRef) {
      const transitions =
        dockedTo !== 'right'
          ? {
              size: {
                height: defaultHeight,
                width: defaultWidth,
                duration: 100
              }
            }
          : {
              size: {
                height: defaultHeight,
                width: defaultWidth,
                duration: 100
              },
              position: {
                left: -defaultWidth,
                duration: 100,
                relative: true
              }
            };
      const options = {
        interrupt: false,
        tween: 'ease-in'
      };
      windowRef.animate(transitions, options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populate]);

  const activeTool = tools
    .filter(tool => tool.visible && tool.disabled)
    .map((tool, index) => (
      <Components.Buttons.Round
        key={index}
        onClick={() => setShowSelector(!showSelector)}
        className={cx({ [tool.className]: tool.className })}
      >
        {tool.label}
        {(dockedTo === 'top' || dockedTo === 'none') && (
          <span>{tool.description}</span>
        )}
      </Components.Buttons.Round>
    ));
  const defaultTool =
    activeTool.length === 0 &&
    tools
      .filter(tool => tool.visible && tool.default)
      .map((tool, index) => (
        <Components.Buttons.Round
          key={index}
          onClick={() => setShowSelector(!showSelector)}
          className={cx({ [tool.className]: tool.className })}
        >
          {tool.label}
          {(dockedTo === 'top' || dockedTo === 'none') && (
            <span>{tool.description}</span>
          )}
        </Components.Buttons.Round>
      ));
  return activeTool.length > 0 ? (
    <div ref={dockSelectorButton} className={`dockselector ${iconStyle}`}>
      {activeTool}
    </div>
  ) : (
    <div ref={dockSelectorButton} className={`dockselector ${iconStyle}`}>
      {defaultTool}
    </div>
  );
};
export default DockSelector;
