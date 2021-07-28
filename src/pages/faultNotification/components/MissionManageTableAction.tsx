/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import NewKanbanModal from '../modals/NewKanbanModal';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const MissionManageTableAction: React.FC<Props> = props => {
  const { state } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  return (
    <Fragment>
      <AuthorityBtn isShow={btnAuthority && btnAuthority.exceptionNoticeManage_2_create}>
        <NewKanbanModal
          btnText="新增配置"
          type="primary"
          state={props.state}
          setState={props.setState}
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
