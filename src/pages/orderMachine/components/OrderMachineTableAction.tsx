/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AddOrderMachineDrawer from './AddOrderMachineDrawer';
 
interface Props {
  state?: any;
  setState?: (value) => void;
}
const OrderMachineAction: React.FC<Props> = (props) => {
  return (
      <Fragment>
        <AddOrderMachineDrawer
          action="add"
          titles="新增订购机器"
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
export default OrderMachineAction;
  