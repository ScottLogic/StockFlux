import PropTypes from 'prop-types';

export default PropTypes.shape({
  exchange: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool
});
