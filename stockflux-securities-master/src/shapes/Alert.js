import PropTypes from 'prop-types';
import { AlertType } from '../components/alerts/AlertType';

export default PropTypes.shape({
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf([AlertType.SUCCESS, AlertType.ERROR]).isRequired
});
