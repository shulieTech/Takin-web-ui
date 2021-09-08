import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React from 'react';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import AppManageService from '../service';
import getDbFormDataOld from './DbFormDataOld';
import getDynamicDbFormData from './DynamicDbFormData';
interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSccuess?: () => void;
  detailData?: any;
  disabled?: boolean;
}

const getInitState = () => ({
  form: null as WrappedFormUtils,
  dbTableDetail: {} as any,
  typeRadioData: [
    {
      label: '影子库影子表',
      value: '1'
    },
    {
      label: '影子库',
      value: '2'
    },
    {
      label: '影子表',
      value: '3'
    }
  ]
});
export type EditDynamicDbDrawerState = ReturnType<typeof getInitState>;
const EditDynamicDbDrawer: React.FC<Props> = props => {
  const { action, id, titles, detailData, disabled } = props;
  const [state, setState] = useStateReducer(getInitState());

  const handleClick = async () => {
    // console.log(1);
  };

  const handleCancle = async () => {
    setState({});
  };

  /**
   * @name 获取影子库表详情
   */
  const queryDbTableDetail = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryDbTableDetailOld({ id });
    if (success) {
      //   console.log(1);
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

        /**
         * @name 编辑影子库表
         */
        if (action === 'edit') {
          const {
            data: { success, data }
          } = await AppManageService.editDbTableOld({
            id
          });
          if (success) {
            openNotification('修改影子库表成功');
            setState({});
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
        title: '影子库表配置',
        maskClosable: false
      }}
      drawerFooterProps={{
        okText: '确认配置',
        style: { zIndex: 10 }
      }}
      btnProps={
        action === 'add'
          ? {
            disabled: props.disabled
          }
          : {
            type: 'link',
            disabled: props.disabled
          }
      }
      beforeOk={() => handleSubmit()}
      onClick={() => handleClick()}
      afterCancel={() => handleCancle()}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getDynamicDbFormData(state, action, setState, detailData)}
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
export default EditDynamicDbDrawer;
