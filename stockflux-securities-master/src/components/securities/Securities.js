import React from 'React';
import { PageHeader } from './page-header/PageHeader';
import { Table } from './table/Table';
import PropTypes from 'prop-types';

const Securities = () => {
  return (
    <div className="securities">
      <PageHeader />
      <Table />
    </div>
  );
};

Securities.prototypes = {};

export default Securities;
