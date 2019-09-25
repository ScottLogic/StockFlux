import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { OpenfinApiHelpers } from 'stockflux-core';

export default ({ subscribeTopics, shouldInheritFromParent }) => {
  const [childWindow, setChildWindow] = useState(null);
  const [childDOM, setChildDOM] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);

  useEffect(() => {
    if (childWindow !== null) setChildDOM(childWindow.getWebWindow().document);
  }, [childWindow]);

  // This useEffect is highly based on useInterApplicationBusSubscribe from openfin-react-hooks
  useEffect(() => {
    const getUuid = async () => {
      const options = await OpenfinApiHelpers.getCurrentWindowSync().getOptions();
      return { uuid: options && options.uuid ? options.uuid : '*' };
    };

    if (subscribeTopics.length > 0) {
      subscribeTopics.forEach(topic => {
        let isSubscribed = false;
        let subscriptionError = false;

        const onReceiveMessage = (message, uuid, name) => {
          if (!subscriptionError && isSubscribed && message) {
            setSubscriptions({
              [topic]: {
                data: { message, uuid, name },
                subscriptionError,
                isSubscribed
              }
            });
          }
        };

        if (isSubscribed || !window.fin || !window.fin.InterApplicationBus) {
          return () => null;
        }

        window.fin.InterApplicationBus.subscribe(
          getUuid(),
          topic,
          onReceiveMessage
        )
          .then(() => (isSubscribed = true))
          .catch(e => (subscriptionError = e));
      });
    }
  }, [subscribeTopics]);

  const launch = async windowProps => {
    const window = await OpenfinApiHelpers.createWindow(windowProps);
    setChildWindow(window);

    if (shouldInheritFromParent) {
      inheritFromParent();
    }
  };

  const inheritFromParent = () => {
    const parentStyles = document.getElementsByTagName('style');
    const parentScripts = document.getElementsByTagName('script');

    injectNodes(childDOM, parentStyles);
    injectNodes(childDOM, parentScripts);
  };

  const injectNodes = (childDOM, nodes) => {
    for (let node of nodes) {
      injectNode(childDOM, node);
    }
  };

  const injectNode = (childDOM, node) => {
    childDOM.getElementsByTagName('head')[0].appendChild(node.cloneNode(true));
  };

  const populateDOM = (html, cssUrl) => {
    ReactDOM.render(html, childDOM.getElementById('root'));

    if (cssUrl) {
      var linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.setAttribute('href', cssUrl);
      injectNode(childDOM, linkElement);
    }
  };

  return [childWindow, subscriptions, launch, populateDOM];
};
