import { useState, useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, {
  initialChildWindowState
} from '../../reducers/child-window/ChildWindow';
import childWindowState from '../../reducers/child-window/State';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (name, document, cssUrl) => {
  const [state, dispatch] = useReducer(reducer, initialChildWindowState);
  const [window, setWindow] = useState(null);

  const injectNode = useCallback(
    node => {
      window
        .getWebWindow()
        .document.getElementsByTagName('head')[0]
        .appendChild(node.cloneNode(true));
    },
    [window]
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
    if (window) {
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
  }, [window, cssUrl, document, inheritFromParent, injectNode]);

  const closeExistingWindows = async () => {
    const childWindows = await OpenfinApiHelpers.getChildWindows();

    const promises = await Promise.all(
      childWindows.map(childWindow => childWindow.getWebWindow())
    );
    promises.forEach(webWindow => {
      if (webWindow.name === name) {
        webWindow.close();
      }
    });
  };

  const launch = async windowProps => {
    if (state !== childWindowState.launching) {
      try {
        dispatch({ type: childWindowState.launching });
        await closeExistingWindows();
        setWindow(await OpenfinApiHelpers.createWindow(windowProps));
        dispatch({ type: childWindowState.launched });
      } catch (error) {
        dispatch({ type: childWindowState.error, error });
      }
    }
  };

  const populateDOM = jsx => {
    if (window) {
      try {
        dispatch({ type: childWindowState.populating });
        ReactDOM.render(
          jsx,
          window.getWebWindow().document.getElementById('root')
        );
        dispatch({ type: childWindowState.populated });
      } catch (error) {
        dispatch({ type: childWindowState.error, error });
      }
    }
  };

  const close = () => {
    try {
      if (window) {
        dispatch({ type: childWindowState.initial });
        window.close();
        setWindow(null);
      }
    } catch (error) {
      dispatch({ type: childWindowState.error, error });
    }
  };
  return { window, state, launch, populateDOM, close };
};
