import { useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, {
  initialChildWindowState
} from '../../reducers/child-window/ChildWindow';
import STATE_TYPE from '../../reducers/child-window/State';
import ACTION_TYPE from '../../reducers/child-window/Action';
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

  const closeExistingWindows = useCallback(async () => {
    const childWindows = await OpenfinApiHelpers.getChildWindows();

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
      type: ACTION_TYPE.CHANGE_STATE,
      payload: STATE_TYPE.ERROR,
      error
    });
  };

  const dispatchNewState = state =>
    dispatch({
      type: ACTION_TYPE.CHANGE_STATE,
      payload: state
    });

  const launch = useCallback(
    async windowOptions => {
      if (childWindow.state !== STATE_TYPE.LAUNCHING) {
        try {
          dispatchNewState(STATE_TYPE.LAUNCHING);
          await closeExistingWindows();
          dispatch({
            type: ACTION_TYPE.SET_WINDOW,
            payload: await OpenfinApiHelpers.createWindow(windowOptions)
          });
          dispatchNewState(STATE_TYPE.LAUNCHED);
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
          dispatchNewState(STATE_TYPE.POPULATING);
          ReactDOM.render(
            jsx,
            childWindow.window.getWebWindow().document.getElementById('root')
          );
          dispatchNewState(STATE_TYPE.POPULATED);
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
        dispatch({ type: ACTION_TYPE.RESET });
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
