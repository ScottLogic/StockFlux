import { PropTypes } from 'react';

const selectionShape = PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string
}).isRequired;

export default selectionShape;
