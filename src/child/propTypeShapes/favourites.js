import { PropTypes } from 'react';

const favouritesShape = PropTypes.shape({
    codes: PropTypes.array.isRequired,
    names: PropTypes.object.isRequired
});

export default favouritesShape;
