/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddAndEditBlacklistDrawer from './AddAndEditBlacklistDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const BlacklistTableAction: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const { state } = props;
  return (
    <Fragment>
      <AuthorityBtn
        isShow={btnAuthority && btnAuthority.configCenter_blacklist_2_create}
      >
        <AddAndEditBlacklistDrawer
          action="add"
          titles="新增黑名单"
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
export default BlacklistTableAction;
