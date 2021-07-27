/**
 * @name
 * @author MingShined
 */
import { Button, Icon, message, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React from 'react';
import styles from '../index.less';
import AuthorityConfigService from '../service';
interface Props {
  onSuccess: () => void;
  ids: string | string[];
  btnProps?: ButtonProps;
}
const DeleteAccountBtn: React.FC<Props> = props => {
  const isBatch = Array.isArray(props.ids) || !props.ids;
  /**
   * @name 删除账号
   */
  const handleDeleteAccount = async () => {
    Modal.confirm({
      icon: (
        <Icon
          type="question-circle"
          theme="filled"
          style={{ color: 'var(--FunctionalError-500)' }}
          className={styles.ModalIcon}
        />
      ),
      title: `${isBatch ? '批量' : ''}删除账号`,
      content: (
        <span style={{ fontSize: 13, color: '#8C8C8C' }}>
          账号删除后将无法恢复，确定删除吗？
        </span>
      ),
      okText: '确认删除',
      maskClosable: true,
      okButtonProps: { style: { color: '#EA5B3C' }, type: 'default' },
      onOk: async () => {
        const {
          data: { success }
        } = await AuthorityConfigService.deleteAccount({
          userIdList: isBatch ? props.ids : [props.ids]
        });
        if (success) {
          message.success('删除成功');
          props.onSuccess();
        }
      }
    });
  };
  return (
    <Button {...props.btnProps} onClick={handleDeleteAccount} type="link">
      {isBatch ? '批量' : ''}删除
    </Button>
  );
};
export default DeleteAccountBtn;
