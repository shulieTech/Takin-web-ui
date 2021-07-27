/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const TableAction: React.FC<Props> = props => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  return (
    <Fragment>
      <AuthorityBtn isShow={btnAuthority && btnAuthority.businessFlow_2_create}>
        <Link to="/businessFlow/addBusinessFlow?action=add">
          <Button type="primary">新增业务流程</Button>
        </Link>
      </AuthorityBtn>
    </Fragment>
  );
};
export default TableAction;
