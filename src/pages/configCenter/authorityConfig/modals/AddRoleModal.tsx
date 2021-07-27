import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './../index.less';
import AuthorityConfigService from '../service';
import getRoleFormData from '../components/RoleFormData';

interface Props {
  btnText?: string | React.ReactNode;
  accountIds: string[];
  roles: any[];
  onSccuess?: () => void;
  disabled?: boolean;
}

interface State {
  roleList: any;
  roles: any;
  form: any;
}
const AddRoleModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    roleList: [],
    roles: undefined,
    form: null as WrappedFormUtils
  });
  const { accountIds, roles } = props;

  const handleClick = () => {
    const rolesArr =
      roles &&
      roles.map((item, k) => {
        return item.id && item.id.toString();
      });
    setState({
      roles: rolesArr ? rolesArr : undefined
    });
    queryRoleList();
  };

  /**
   * @name 获取角色列表
   */
  const queryRoleList = async () => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryRoleList({});
    if (success) {
      setState({
        roleList:
          data &&
          data.map((item, k) => {
            return { label: item.roleName, value: item.id };
          })
      });
    }
  };

  const handleCancle = () => {
    setState({
      roles: undefined
    });
  };

  /**
   * @name 分配角色
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        if (values && values.roleIds && values.roleIds.length > 10) {
          message.error('分配的角色不得超过10个');
          resolve(false);
          return false;
        }
        const {
          data: { success, data }
        } = await AuthorityConfigService.addRoleToAccount({
          ...values,
          accountIds
        });
        if (success) {
          message.success('分配角色成功');
          props.onSccuess();
          resolve(true);
        }

        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 482,
        title: '分配角色'
      }}
      btnProps={{
        type: 'link',
        disabled: props.disabled,
        style: { color: props.disabled ? 'var(--Netural-07)' : null }
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getRoleFormData(state, setState)}
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false
          }}
          rowNum={1}
          formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
        />
      </div>
    </CommonModal>
  );
};
export default AddRoleModal;
