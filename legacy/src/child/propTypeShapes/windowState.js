import * as PropTypes from 'prop-types';

const windowStateShape = PropTypes.shape({
    isCompact: PropTypes.bool.isRequired,
    isMaximized: PropTypes.bool.isRequired,
    isResizing: PropTypes.bool.isRequired,
    previousExpandedDimensions: PropTypes.array.isRequired,
    previousMaximizedState: PropTypes.bool.isRequired
});

export default windowStateShape;
