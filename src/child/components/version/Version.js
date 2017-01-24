import React from 'react';
import version from '../../../shared/versionValue';
import currentWindowService from '../../services/currentWindowService';

export default () => (
    <a
      className="version"
      onClick={() => currentWindowService.openUrlWithBrowser('https://github.com/ScottLogic/StockFlux')}
      title="Open project on GitHub"
    >
        GitHub {version}
    </a>
);
