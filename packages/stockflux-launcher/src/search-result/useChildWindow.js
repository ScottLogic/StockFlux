import { useState, useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, {
  initialChildWindowState
} from '../reducers/child-window/ChildWindow';
import childWindowState from '../reducers/child-window/State';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (document, cssUrl) => {
  const [state, dispatch] = useReducer(reducer, initialChildWindowState);
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
      dispatch({ type: childWindowState.launching });
      setChildWindow(await OpenfinApiHelpers.createWindow(windowProps));
      dispatch({ type: childWindowState.launched });
    } catch (error) {
      dispatch({ type: childWindowState.error, error });
    }
  };

  const populateDOM = jsx => {
    if (childWindow) {
      try {
        dispatch({ type: childWindowState.populating });
        ReactDOM.render(
          jsx,
          childWindow.getWebWindow().document.getElementById('root')
        );
        dispatch({ type: childWindowState.populated });
      } catch (error) {
        dispatch({ type: childWindowState.error, error });
      }
    }
  };

  const close = () => {
    try {
      if (childWindow) {
        dispatch({ type: childWindowState.initial });
        childWindow.close();
        setChildWindow(null);
      }
    } catch (error) {
      dispatch({ type: childWindowState.error, error });
    }
  };

  return [childWindow, state, launch, populateDOM, close];
};
