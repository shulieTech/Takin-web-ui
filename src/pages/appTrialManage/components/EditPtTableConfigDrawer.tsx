import React, { Fragment } from 'react';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import { title } from 'process';
import { WrappedFormUtils } from 'antd/lib/form/Form';

import { message, notification } from 'antd';
import AppTrialManageService from '../service';
import getPtFormData from './PtFormData';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSccuess?: () => void;
  detailData?: any;
}
interface State {
  form: any;
  ptTableDetail: any;
}
const EditPtTableConfigDrawer: React.FC<Props> = props => {
  const { action, id, titles, detailData } = props;
  const [state, setState] = useStateReducer<State>({
    form: null as WrappedFormUtils,
    ptTableDetail: {} as any
  });

  const handleClick = async () => {
    queryPtTableDetail();
  };

  /**
   * @name 获取影子表详情
   */
  const queryPtTableDetail = async () => {
    const {
      data: { success, data }
    } = await AppTrialManageService.queryPtTableDetail({ id });
    if (success) {
      setState({
        ptTableDetail: data
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
          dsType: '1'
        };

        /**
         * @name 编辑影子表
         */

        const {
          data: { success, data }
        } = await AppTrialManageService.editPtTable({
          ...result,
          id
        });
        if (success) {
          openNotification('编辑成功');
          props.onSccuess();
          resolve(true);
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
        title: '影子表配置',
        maskClosable: false
      }}
      drawerFooterProps={{
        okText: '确认配置',
        style: { zIndex: 10 }
      }}
      btnProps={{
        type: 'link',
        style: {
          color: '#21D0F4',
          fontSize: 12,
          padding: 0,
          height: 0
        }
      }}
      beforeOk={() => handleSubmit()}
      onClick={() => handleClick()}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getPtFormData(state, setState, detailData)}
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
export default EditPtTableConfigDrawer;
