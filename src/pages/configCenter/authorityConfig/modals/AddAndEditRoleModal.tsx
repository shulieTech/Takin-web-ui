import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './../index.less';
import AuthorityConfigService from '../service';
import getRoleManageFormData from '../components/RoleManageFormData';

interface Props {
  btnText?: string | React.ReactNode;
  action?: string;
  roleId?: string;
  onSccuess?: () => void;
}

interface State {
  form: any;
  roleDetail: any;
  roleGroupList: any[];
}
const AddAndEditRoleModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    roleDetail: null,
    form: null as WrappedFormUtils,
    roleGroupList: []
  });
  const { roleId, action } = props;

  const handleClick = () => {
    if (action === 'edit') {
      queryRoleDetail();
    }
  };

  /**
   * @name 获取角色详情
   */
  const queryRoleDetail = async () => {
    const {
      data: { data, success }
    } = await AuthorityConfigService.queryRoleDetail({ id: roleId });
    if (success) {
      setState({
        roleDetail: data
      });
    }
  };
  /**
   * @name 新增和编辑角色
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        if (action === 'add') {
          const {
            data: { success, data }
          } = await AuthorityConfigService.addRole({
            ...values
          });
          if (success) {
            message.success('新增角色成功');
            props.onSccuess();
            resolve(true);
          }
        }

        if (action === 'edit') {
          const {
            data: { success, data }
          } = await AuthorityConfigService.editRole({
            ...values,
            id: roleId
          });
          if (success) {
            message.success('编辑角色成功');
            props.onSccuess();
            resolve(true);
          }
        }

        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 482,
        title: action === 'add' ? '新增角色' : '编辑角色'
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
    >
      <div>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getRoleManageFormData(state, setState, action)}
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
export default AddAndEditRoleModal;
