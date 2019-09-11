import React from 'react';
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
  );
};

export default DeleteButton;
