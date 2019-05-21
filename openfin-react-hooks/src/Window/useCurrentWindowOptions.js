import { useEffect, useState } from 'react';
import withOpenFin from '../withOpenFin';

export default defaultWindowOptions => {
  const [options, setOptions] = useState(defaultWindowOptions);

  useEffect(() => {
    const doWindowActions = async () => {
      const currentWindow = await withOpenFin().Window.getCurrent();
      const windowOptions = await currentWindow.getOptions();

      setOptions(windowOptions);
    };

    doWindowActions();
  }, []);

  return options;
};
