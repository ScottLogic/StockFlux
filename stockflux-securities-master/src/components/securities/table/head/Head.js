import React from 'react';
import './Head.css';

const COLUMN_NAMES = ['Exchange', 'Symbol', 'Name', 'Options'];

const TableHead = () => (
  <thead>
    <tr>
      {COLUMN_NAMES.map(heading => (
        <th key={heading}>{heading}</th>
      ))}
    </tr>
  </thead>
);

export default TableHead;
