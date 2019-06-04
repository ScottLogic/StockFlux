import { useEffect, useState } from 'react';
import { WindowHooks } from '..';

const defaultWindowOptions = {
  customData: {
    apiBaseUrl: 'https://d2v92tgq94yxaa.cloudfront.net/api'
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
