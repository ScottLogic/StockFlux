import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './FreeTextSearch.css';

export default () => (
  <div className="free-text-search">
    <input placeholder="Search" />
    <button><FaSearch /></button>
  </div>
);
