import { useState, useReducer, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import reducer, {
  initialChildWindowState
} from '../reducers/child-window/ChildWindow';
import childWindowState from '../reducers/child-window/State';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (document, cssUrl) => {
  const [state, dispatch] = useReducer(reducer, initialChildWindowState);
  const [windowRef, setWindowRef] = useState(null);

  const injectNode = useCallback(
    node => {
      windowRef
        .getWebWindow()
        .document.getElementsByTagName('head')[0]
        .appendChild(node.cloneNode(true));
    },
    [windowRef]
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
    if (windowRef) {
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
  }, [windowRef, cssUrl, document, inheritFromParent, injectNode]);

  const launch = async windowProps => {
    try {
      dispatch({ type: childWindowState.launching });
      setWindowRef(await OpenfinApiHelpers.createWindow(windowProps));
      dispatch({ type: childWindowState.launched });
    } catch (error) {
      dispatch({ type: childWindowState.error, error });
    }
  };

  const populateDOM = jsx => {
    if (windowRef) {
      try {
        dispatch({ type: childWindowState.populating });
        ReactDOM.render(
          jsx,
          windowRef.getWebWindow().document.getElementById('root')
        );
        dispatch({ type: childWindowState.populated });
      } catch (error) {
        dispatch({ type: childWindowState.error, error });
      }
    }
  };

  const close = () => {
    try {
      if (windowRef) {
        dispatch({ type: childWindowState.initial });
        windowRef.close();
        setWindowRef(null);
      }
    } catch (error) {
      dispatch({ type: childWindowState.error, error });
    }
  };
  return { windowRef, state, launch, populateDOM, close };
};
