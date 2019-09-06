import React from 'react';
import './Head.css';

const COLUMN_NAMES = ['Exchange', 'Symbol', 'Name', 'Options'];

const TableHead = () => (
  <div className="thead">
    <div className="tr">
      {COLUMN_NAMES.map(heading => (
        <div className="th" key={heading}>
          {heading}
        </div>
      ))}
    </div>
  </div>
);

export default TableHead;
