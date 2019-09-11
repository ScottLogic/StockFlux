import React from 'react';
import RoundIcon from '../../../../buttons/round-icon/RoundIcon';
import { FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const BackButton = () => (
  <Link to="/">
    <RoundIcon className="back">
      <FaChevronLeft size={20} />
    </RoundIcon>
  </Link>
);

export default BackButton;
