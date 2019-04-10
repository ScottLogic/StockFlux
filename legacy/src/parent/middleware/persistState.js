import persistState from 'redux-localstorage';
import VERSION from '../../shared/versionValue';

// Set the localStorage key to application version
// to prevent issues if the state shape changes when
// releasing new application vesions
// e.g. StockFlux-10.0.0 (for a production build)
// e.g. StockFlux-DEVELOPMENT (for a development build)
const config = { key: `StockFlux-${VERSION}` };

export default (paths) => persistState(paths, config);
