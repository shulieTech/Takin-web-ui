/* eslint-disable react-hooks/exhaustive-deps */
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import UserPackageManageService from '../service';
import getUserPackageFormData from './UserPackageFormData';

interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSccuess?: () => void;
}
interface State {
  form: any;
  userDetail: any;
  package: any;
  tenantList: any;
  userPackageList: any;
}
const AddUserPackageDrawer: React.FC<Props> = props => {
  const { action, id, titles } = props;
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    userDetail: {} as any,
    package: undefined,
    tenantList: [],
    userPackageList: []
  });

  useEffect(() => {
    queryTenantList();
    queryUserPackage();
  }, []);

  /**
   * @name 获取租户列表
   */
  const queryTenantList = async () => {
    const {
          data: { data, success }
        } = await UserPackageManageService.queryTenantList({});
    if (success) {
      setState({
        tenantList: data
      });
    }
  };

  /**
   * @name 获取用户套餐列表
   */
  const queryUserPackage = async () => {
    const {
              data: { data, success }
            } = await UserPackageManageService.queryUserPackage({});
    if (success) {
      setState({
        userPackageList: data
      });
    }
  };

  /**
   * @name 提交
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        const result = {
          ...values,
          // eslint-disable-next-line eqeqeq
          // tslint:disable-next-line:triple-equals
          numbers: state?.userPackageList?.filter(item => item?.packageId == values?.packageId)?.[0]?.packageType === 0  ? values?.month : values?.number
        };
        delete result.number;
        delete result.month;

        /**
         * @name 增加用户套餐
         */
        if (action === 'add') {
          const {
            data: { success, data }
          } = await UserPackageManageService.addUserPackage(result);
          if (success) {
            message.success('增加用户套餐成功');
            state.form.setFieldsValue({
              package: undefined
            });
            setState({
              package: undefined
            });
            props.onSccuess();
            resolve(true);
          }
        }

        resolve(false);
      });
    });
  };

  return (
    <CommonDrawer
      btnText={titles}
      drawerProps={{
        width: 650,
        title: '新增用户套餐',
        maskClosable: false
      }}
      drawerFooterProps={{
        okText: action === 'add' ? '确认新增' : '确认编辑',
        style: { zIndex: 10 }
      }}
      btnProps={
        action !== 'add' && {
          type: 'link'
        }
      }
      beforeOk={() => handleSubmit()}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getUserPackageFormData(state, action, setState)}
        btnProps={{
          isResetBtn: false,
          isSubmitBtn: false
        }}
        rowNum={1}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 14 } }}
      />
    </CommonDrawer>
  );
};
export default AddUserPackageDrawer;
