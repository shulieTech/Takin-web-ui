/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import AddAndEditSceneModal from '../modals/AddAndEditSceneModal';
import KanbanManagementModal from '../modals/KanbanManagementModal';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const MissionManageTableAction: React.FC<Props> = props => {
  const { state } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const length = Object.keys(btnAuthority).
    filter(item => item.indexOf('patrolBoard') !== -1).length > 0 ? true : false;
  return (
    <Fragment>
      <AuthorityBtn
        isShow={length}
      >
        <KanbanManagementModal
          btnText="看板管理"
          onSuccess={() => {
            props.setState({
              isReload: !state.isReload,
              searchParams: {
                current: 0
              }
            });
          }}
        />
      </AuthorityBtn>
      <span style={{ marginRight: 8 }} />
      <AuthorityBtn isShow={btnAuthority && btnAuthority.patrolManage_2_create}>
        <AddAndEditSceneModal
          btnText="新增场景"
          onSuccess={() => {
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
export default MissionManageTableAction;
