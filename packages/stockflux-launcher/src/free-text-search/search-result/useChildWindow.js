import { useState, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import reducer, { initialState } from './ChildWindowStateReducer';
import ChildWindowState from './ChildWindowState';
import { OpenfinApiHelpers } from 'stockflux-core';

export default (document, cssUrl) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [childWindow, setChildWindow] = useState(null);

  const inheritFromParent = () => {
    const parentStyles = document.getElementsByTagName('style');
    const parentScripts = document.getElementsByTagName('script');

    injectNodes(parentStyles);
    injectNodes(parentScripts);
  };

  const injectNodes = nodes => {
    for (let node of nodes) {
      injectNode(node);
    }
  };

  const injectNode = node => {
    childWindow
      .getWebWindow()
      .document.getElementsByTagName('head')[0]
      .appendChild(node.cloneNode(true));
  };

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
      dispatch(ChildWindowState.launching);
      setChildWindow(await OpenfinApiHelpers.createWindow(windowProps));
      dispatch(ChildWindowState.launched);
    } catch (err) {
      console.error(err);
      dispatch(ChildWindowState.error);
    }
  };

  console.log('*satte', state);

  const populateDOM = html => {
    try {
      dispatch(ChildWindowState.populating);
      ReactDOM.render(
        html,
        childWindow.getWebWindow().document.getElementById('root')
      );
      dispatch(ChildWindowState.populated);
    } catch (err) {
      console.error(err);
      dispatch(ChildWindowState.error);
    }
  };

  const close = () => {
    try {
      if (childWindow) {
        childWindow.close();
        setChildWindow(null);
      }
    } catch (err) {
      console.error(err);
      dispatch(ChildWindowState.error);
    }
  };

  return [childWindow, state, launch, populateDOM, close];
};
