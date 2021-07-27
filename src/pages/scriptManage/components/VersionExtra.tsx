/**
 * @name
 * @author MingShined
 */
import { Button, message, Modal } from 'antd';
import React, { Fragment } from 'react';
import { router } from 'umi';
import ScriptManageService from '../service';
import { VersionHistoryChildrenProps } from '../versionPage';

const VersionExtra: React.FC<VersionHistoryChildrenProps> = props => {
  const handleClick = () => {
    if (!props.current) {
      message.info('请选择版本');
      return;
    }
    Modal.confirm({
      title: '确认恢复为此版本？',
      icon: ' ',
      okText: '确定',
      cancelText: '取消',
      maskClosable: true,
      onOk: handleSubmit
    });
  };
  const handleSubmit = async () => {
    const {
      data: { success }
    } = await ScriptManageService.resetVersion({
      scriptDeployId: props.current
    });
    if (success) {
      message.success('恢复成功');
      router.push('/scriptManage');
    }
  };
  return (
    <Fragment>
      <Button onClick={handleClick} type="primary">
        恢复至此版本
      </Button>
    </Fragment>
  );
};
export default VersionExtra;
