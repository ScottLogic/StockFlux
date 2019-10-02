import { useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, {
  initialChildWindowState
} from '../../reducers/child-window/ChildWindow';
import childWindowState from '../../reducers/child-window/State';
import action from '../../reducers/child-window/Actions';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (name, document, cssUrl) => {
  const [childWindow, dispatch] = useReducer(reducer, initialChildWindowState);

  const injectNode = useCallback(
    node => {
      if (childWindow.window) {
        childWindow.window
          .getWebWindow()
          .document.getElementsByTagName('head')[0]
          .appendChild(node.cloneNode(true));
      }
    },
    [childWindow.window]
  );

  const injectNodes = useCallback(
    nodes => {
      for (let node of nodes) {
        injectNode(node);
      }
    },
    [injectNode]
  );

  const inheritFromParent = useCallback(() => {
    const parentStyles = document.getElementsByTagName('style');
    const parentScripts = document.getElementsByTagName('script');

    injectNodes(parentStyles);
    injectNodes(parentScripts);
  }, [document, injectNodes]);

  useEffect(() => {
    if (childWindow.window) {
      if (document) {
        inheritFromParent();
      }

      if (cssUrl) {
        const linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', cssUrl);
        injectNode(linkElement);
      }
    }
  }, [childWindow.window, cssUrl, document, inheritFromParent, injectNode]);

  const closeExistingWindows = async () => {
    const childWindows = await OpenfinApiHelpers.getChildWindows();

    const promises = await Promise.all(
      childWindows.map(child => child.getWebWindow())
    );
    promises.forEach(webWindow => {
      if (webWindow.name === name) {
        webWindow.close();
      }
    });
  };

  const dispatchError = error =>
    dispatch({
      type: action.changeState,
      payload: childWindowState.error,
      error
    });

  const dispatchNewState = state =>
    dispatch({
      type: action.changeState,
      payload: state
    });

  const launch = async windowOptions => {
    if (childWindow.state !== childWindowState.launching) {
      try {
        dispatchNewState(childWindowState.launching);
        await closeExistingWindows();
        dispatch({
          type: action.setWindow,
          payload: await OpenfinApiHelpers.createWindow(windowOptions)
        });
        dispatchNewState(childWindowState.launched);
      } catch (error) {
        dispatchError(error);
      }
    }
  };

  const populateDOM = jsx => {
    if (childWindow.window) {
      try {
        dispatchNewState(childWindowState.populating);
        ReactDOM.render(
          jsx,
          childWindow.window.getWebWindow().document.getElementById('root')
        );
        dispatchNewState(childWindowState.populated);
      } catch (error) {
        dispatchError(error);
      }
    }
  };

  const close = () => {
    try {
      if (childWindow.window) {
        childWindow.window.close();
        dispatch({ type: action.reset });
      }
    } catch (error) {
      dispatchError(error);
    }
  };
  return {
    window: childWindow.window,
    state: childWindow.state,
    launch,
    populateDOM,
    close
  };
};
