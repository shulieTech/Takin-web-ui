import React from 'react';
import AccountList from './AccountList';
import TreeSearch from './TreeSearch';

interface Props {
  state: any;
  setState: (value: any) => void;
}
const AccountManage: React.FC<Props> = props => {
  const { state, setState } = props;
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      <TreeSearch state={state} setState={setState} />
      <AccountList state={state} setState={setState} />
    </div>
  );
};
export default AccountManage;
