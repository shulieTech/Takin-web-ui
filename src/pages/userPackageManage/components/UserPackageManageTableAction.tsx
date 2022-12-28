/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AddUserPackageDrawer from './AddUserPackageDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const UserPackageTableManageAction: React.FC<Props> = props => {
  return (
     <Fragment>
       <AddUserPackageDrawer
         action="add"
         titles="新增用户套餐"
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
export default UserPackageTableManageAction;
 