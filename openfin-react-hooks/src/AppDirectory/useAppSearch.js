import { useEffect, useState } from 'react';
import { WindowHooks } from '..';

const defaultWindowOptions = {
  customData: {
    apiBaseUrl: 'https://lf467ndb08.execute-api.eu-west-2.amazonaws.com/dev/api'
  }
};

export default () => {
  const [appResults, setAppResults] = useState([]);

  const { customData: { apiBaseUrl } } = WindowHooks.useCurrentWindowOptions(defaultWindowOptions);

  useEffect(() => {
    const options = {
      method: 'GET',
    };

    fetch(`${apiBaseUrl}/apps/v1`, options)
      .then(response => response.json())
      .then(results => setAppResults(results))
      .catch(console.error);
  }, []);

  return appResults;
};
