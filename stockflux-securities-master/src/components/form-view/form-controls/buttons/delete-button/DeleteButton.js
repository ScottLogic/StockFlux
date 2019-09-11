import React from 'react';
import PropTypes from 'prop-types';
import RoundIcon from '../../../../buttons/round-icon/RoundIcon';
import { FaTrashAlt } from 'react-icons/fa';
import { deleteSecurity } from '../../../../../services/SecuritiesService';
import Confirmation from '../../../../confirmation/Confirmation';

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
  securityId: PropTypes.string.isRequired,
  setRedirect: PropTypes.func.isRequired
};
export default DeleteButton;
