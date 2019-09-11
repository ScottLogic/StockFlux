import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import RoundIcon from '../../../../buttons/round-icon/RoundIcon';
import './BackButton.css';

const BackButton = () => (
  <Link to="/">
    <RoundIcon className="back">
      <FaChevronLeft size={20} />
    </RoundIcon>
  </Link>
);

export default BackButton;
