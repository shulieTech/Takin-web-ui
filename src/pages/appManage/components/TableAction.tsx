/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddAppDrawer from './AddAppDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const TableAction: React.FC<Props> = props => {
  const { state } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return (
    <Fragment>
      <AuthorityBtn isShow={btnAuthority && btnAuthority.appManage_2_create}>
        <AddAppDrawer
          action="add"
          titles="新增应用"
          disabled={
            state.switchStatus === 'OPENING' || state.switchStatus === 'CLOSING'
              ? true
              : false
          }
          onSccuess={() => {
            props.setState({
              isReload: !state.isReload,
              searchParams: {
                current: 0
              }
            });
          }}
        />
      </AuthorityBtn>
    </Fragment>
  );
};
export default TableAction;
