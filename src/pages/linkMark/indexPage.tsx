import React, { Fragment } from 'react';
import LinkCard from './components/LinkCard';
import ChartCard from './components/ChartCard';
import MiddleWareTable from './components/MiddleWareTable';

interface Props {}
const LinkMark: React.FC<Props> = props => {
  return (
    <div style={{ padding: 16 }}>
      <LinkCard />
      <ChartCard />
      <MiddleWareTable />
    </div>
  );
};
export default LinkMark;
