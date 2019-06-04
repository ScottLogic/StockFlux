import { useEffect, useState } from 'react';

export default () => {
  const [appResults, setAppResults] = useState([]);
  
  useEffect(() => {
    const options = {
      method: 'GET',
    };

    window.fin.Window.getCurrent()
      .then(window => window.getOptions())
      .then(options => options.customData.apiBaseUrl)
      .then(baseUrl => fetch(`${baseUrl}/apps/v1`, options))
      .then(response => response.json())
      .then(results => setAppResults(results))
      .catch(console.error);
    }, []);

  return appResults;
};
