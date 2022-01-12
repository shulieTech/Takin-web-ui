/**
 * @name
 * @author chuxu
 */
import { Button, message } from 'antd';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import AppManageService from '../service';
import AddAppDrawer from './AddAppDrawer';

interface Props {
  state?: any;
  setState?: (value) => void;
}
const TableAction: React.FC<Props> = props => {
  const { state, setState } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 卸载
   */
  const handleUninstall = async values => {
    const {
      data: { success, data }
    } = await AppManageService.uninstall({
      appIds: values
    });
    if (success) {
      message.success('卸载成功！');
      setState({
        isReload: !state.isReload,
        checkedKeys: []
      });
    }
  };

  /**
   * @name 恢复
   */
  const handleRecover = async values => {
    const {
      data: { success, data }
    } = await AppManageService.recover({
      appIds: values
    });
    if (success) {
      message.success('恢复成功！');
      setState({
        isReload: !state.isReload,
        checkedKeys: []
      });
    }
  };
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
