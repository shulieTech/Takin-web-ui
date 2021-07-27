/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Button, Statistic, Tooltip } from 'antd';
import Link from 'umi/link';
import styles from './../index.less';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const ShellManageTableAction: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  return (
    <Fragment>
      <AuthorityBtn isShow={true}>
        <Link to="/shellManage/shellConfig?action=add">
          <Button type="primary">新增shell脚本</Button>
        </Link>
      </AuthorityBtn>
    </Fragment>
  );
};
export default ShellManageTableAction;
