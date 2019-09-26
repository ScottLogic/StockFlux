import { useState, useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, { initialState } from './ChildWindowStateReducer';
import ChildWindowState from './ChildWindowState';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (document, cssUrl) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [childWindow, setChildWindow] = useState(null);

  const injectNode = useCallback(
    node => {
      childWindow
        .getWebWindow()
        .document.getElementsByTagName('head')[0]
        .appendChild(node.cloneNode(true));
    },
    [childWindow]
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
    if (childWindow) {
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
  }, [childWindow, cssUrl, document, inheritFromParent, injectNode]);

  const launch = async windowProps => {
    try {
      dispatch({ type: ChildWindowState.launching });
      setChildWindow(await OpenfinApiHelpers.createWindow(windowProps));
      dispatch({ type: ChildWindowState.launched });
    } catch (error) {
      dispatch({ type: ChildWindowState.error, error });
    }
  };

  const populateDOM = html => {
    try {
      dispatch({ type: ChildWindowState.populating });
      ReactDOM.render(
        html,
        childWindow.getWebWindow().document.getElementById('root')
      );
      dispatch({ type: ChildWindowState.populated });
    } catch (error) {
      dispatch({ type: ChildWindowState.error, error });
    }
  };

  const close = () => {
    try {
      if (childWindow) {
        childWindow.close();
        dispatch({ type: ChildWindowState.initial });
        setChildWindow(null);
      }
    } catch (error) {
      dispatch({ type: ChildWindowState.error, error });
    }
  };

  return [childWindow, state, launch, populateDOM, close];
};
