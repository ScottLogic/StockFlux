import React from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import Confirmation from '../../../../confirmation/Confirmation';
import RoundIcon from '../../../../buttons/round-icon/RoundIcon';
import { deleteSecurity } from '../../../../../services/SecuritiesService';
import './DeleteButton.css';

const DeleteButton = ({ securityId, setRedirect }) => {
  const confirmedDelete = () => {
    deleteSecurity(securityId);
    setRedirect(true);
  };

  return (
    <>
      {securityId && (
        <Confirmation confirmationText="Are you sure you want to delete this security?">
          <RoundIcon
            className="delete"
            onClick={() => {
              confirmedDelete();
            }}
          >
            <FaTrashAlt size={16} />
          </RoundIcon>
        </Confirmation>
      )}
    </>
  );
};

DeleteButton.propTypes = {
  securityId: PropTypes.string,
  setRedirect: PropTypes.func.isRequired
};
export default DeleteButton;
