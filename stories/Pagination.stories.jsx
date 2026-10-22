import React from 'react';
import { Pagination } from '../components/navigation/Pagination.jsx';

export default {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "page": {
    "control": "number"
  },
  "pageCount": {
    "control": "number"
  },
  "onChange": {
    "control": false
  }
},
};

export const Default = { render: function P(args) { const [page, setPage] = React.useState(1); return <Pagination page={page} pageCount={8} onChange={setPage}  {...args}/>; } };

export const Matrix = {
  name: 'Matrix / Pages',
  render: function P() {
    const [page, setPage] = React.useState(2);
    return <Pagination page={page} pageCount={12} onChange={setPage} />;
  },
};
