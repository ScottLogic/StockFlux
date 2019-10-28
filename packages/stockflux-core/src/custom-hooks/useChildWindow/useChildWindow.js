import { useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, { initialChildWindowState } from './reducers/ChildWindow';
import childWindowState from './reducers/State';
import action from './reducers/Actions';
import {
  createWindow,
  getChildWindows
} from '../../openfin-api-utils/openfinApiHelpers';

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

  const closeExistingWindows = useCallback(async () => {
    const childWindows = await getChildWindows();

    await Promise.all(
      childWindows.map(win =>
        win.identity.name && win.identity.name === name
          ? win.close()
          : Promise.resolve()
      )
    );
  }, [name]);

  const dispatchError = error => {
    console.error(error);
    dispatch({
      type: action.changeState,
      payload: childWindowState.error,
      error
    });
  };

  const dispatchNewState = state =>
    dispatch({
      type: action.changeState,
      payload: state
    });

  const launch = useCallback(
    async windowOptions => {
      if (childWindow.state !== childWindowState.launching) {
        try {
          dispatchNewState(childWindowState.launching);
          await closeExistingWindows();
          dispatch({
            type: action.setWindow,
            payload: await createWindow(windowOptions)
          });
          dispatchNewState(childWindowState.launched);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.state, closeExistingWindows]
  );

  const populateDOM = useCallback(
    jsx => {
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
    },
    [childWindow.window]
  );

  const close = useCallback(() => {
    try {
      if (childWindow.window) {
        childWindow.window.close();
        dispatch({ type: action.reset });
      }
    } catch (error) {
      dispatchError(error);
    }
  }, [childWindow.window]);

  return {
    window: childWindow.window,
    state: childWindow.state,
    launch,
    populateDOM,
    close
  };
};
