import React from 'react';
import PropTypes from 'prop-types';
import AlertShape from '../../shapes/Alert';
import './Alerts.css';

const Alerts = ({ alerts }) => (
  <>
    {alerts && alerts.length !== 0 && (
      <div className="alerts">
        {alerts.length === 1 ? (
          <p className={alerts[0].type.valueOf()}>{alerts[0].message}</p>
        ) : (
          <ul>
            {alerts.map((alert, index) => (
              <li className={alert.type.valueOf()} key={index}>
                {alert.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    )}
  </>
);

Alerts.propTypes = {
  alerts: PropTypes.arrayOf(AlertShape).isRequired
};

export default Alerts;
