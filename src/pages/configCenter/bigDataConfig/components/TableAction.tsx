/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import EditModal from '../modals/EditModal';

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
      <AuthorityBtn isShow={btnAuthority && btnAuthority.configCenter_authorityConfig_2_create}>
        <EditModal
          btnText="新增"
          onSuccess={() => {
            props.setState({
              reload: !state.reload,
            });
          }}
        />
      </AuthorityBtn>
    </Fragment>
  );
};
export default TableAction;
