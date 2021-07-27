/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Button, Statistic, Tooltip } from 'antd';
import styles from './../index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import ScriptModal from '../modals/ScriptModal';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const ScriptManageTableAction: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  return (
    <Fragment>
      <AuthorityBtn isShow={btnAuthority && btnAuthority.scriptManage_2_create}>
        <ScriptModal btnText="新增运维脚本" type="primary" state={props.state} setState={props.setState}/>
      </AuthorityBtn>
    </Fragment>
  );
};
export default ScriptManageTableAction;
