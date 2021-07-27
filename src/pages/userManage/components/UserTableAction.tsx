/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AddAndEditUserDrawer from './AddAndEditUserDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const UserTableAction: React.FC<Props> = props => {
  return (
    <Fragment>
      <AddAndEditUserDrawer
        action="add"
        titles="新增客户"
        onSccuess={() => {
          props.setState({
            isReload: !props.state.isReload,
            searchParams: {
              current: 0
            }
          });
        }}
      />
    </Fragment>
  );
};
export default UserTableAction;
