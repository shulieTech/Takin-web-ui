import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React from 'react';
import OrderMachineService from '../service';
import getOrderMachineFormData from './OrderMachineFormData';

interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSccuess?: () => void;
}
interface State {
  form: any;
  userDetail: any;
}
const AddOrderMachineDrawer: React.FC<Props> = (props) => {
  const { action, id, titles } = props;
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    userDetail: {} as any,
  });

  /**
   * @name 提交
   */
  const handleSubmit = async () => {
    return new Promise((resolve) => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        const result = {
          ...values
        };

        /**
         * @name 增加订购机器
         */
        if (action === 'add') {
          const {
            data: { success, data }
          } = await OrderMachineService.addUser(result);
          if (success) {
            message.success('增加客户成功');
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
        getForm={(form) => setState({ form })}
        formData={getOrderMachineFormData(state, action, setState)}
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
export default AddOrderMachineDrawer;
