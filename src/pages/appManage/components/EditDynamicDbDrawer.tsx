import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React from 'react';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import { DbDetailBean } from '../enum';
import AppManageService from '../service';
import getDynamicDbFormData from './DynamicDbFormData';
interface Props {
  action?: string;
  id?: string | Number;
  titles?: string | React.ReactNode;
  onSuccess?: () => void;
  middlewareType: string;
  applicationId: string;
  connectionPool: string;
  agentSourceType: string;
  isNewData: boolean;
  cacheType: string;
}

const getInitState = () => ({
  form: null as WrappedFormUtils,
  dbTableDetail: {} as any,
  dsType: undefined,
  typeRadioData: [],
  templateData: [],
  dbAndTableList: []
});
export type EditDynamicDbDrawerState = ReturnType<typeof getInitState>;
const EditDynamicDbDrawer: React.FC<Props> = props => {
  const { action, id, titles, isNewData, cacheType } = props;
  const [state, setState] = useStateReducer(getInitState());

  const handleClick = async () => {
    queryDbTableDetail();
    queryType();
  };

  const handleCancle = async () => {
    setState({
      form: null as WrappedFormUtils,
      dbTableDetail: {} as any,
      dsType: undefined,
      typeRadioData: [],
      templateData: [],
      dbAndTableList: []
    });
  };

  /**
   * @name 获取影子库表详情
   */
  const queryDbTableDetail = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryDynamicDbTableDetail({
      applicationId: props.applicationId,
      middlewareType: props.middlewareType,
      recordId: id,
      isNewData: props.isNewData
    });
    if (success) {
      setState({
        dbTableDetail: data,
        dsType:
          data.dsType || data.dsType === 0 ? String(data.dsType) : data.dsType
      });
    }
  };

  /**
   * @name 获取隔离方案（动态数据）
   */
  const queryType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryDynamicProgramme({
      middlewareType: props.middlewareType,
      plugName: props.connectionPool
    });
    if (success) {
      setState({
        typeRadioData: data
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

        const newResult = { ...values };
        delete newResult[DbDetailBean.业务数据源];
        delete newResult[DbDetailBean.业务集群];
        delete newResult[DbDetailBean.中间件名称];
        delete newResult[DbDetailBean.中间件类型];
        delete newResult[DbDetailBean.缓存模式];
        delete newResult[DbDetailBean.隔离方案];

        const result = {
          ...values,
          extInfo: JSON.stringify({ ...newResult })
        };

        /**
         * @name 编辑影子库表
         */

        const {
          data: { success, data }
        } = await AppManageService.editDynamicDbTable({
          applicationId: props.applicationId,
          isNewData: props.isNewData,
          id: props.id,
          ...result
        });
        if (success) {
          openNotification('修改影子库表成功');
          setState({
            form: null as WrappedFormUtils,
            dbTableDetail: {} as any,
            dsType: undefined,
            typeRadioData: [],
            templateData: [],
            dbAndTableList: []
          });
          props.onSuccess();
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
        width: 700,
        title: '影子库表配置',
        maskClosable: false
      }}
      drawerFooterProps={{
        okText: '确认配置',
        style: { zIndex: 10 }
      }}
      btnProps={
        action === 'add'
          ? {}
          : {
            type: 'link'
          }
      }
      beforeOk={() => handleSubmit()}
      onClick={() => handleClick()}
      afterCancel={() => handleCancle()}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getDynamicDbFormData(
          state,
          action,
          setState,
          state.dbTableDetail,
          props.middlewareType,
          props.agentSourceType,
          isNewData,
          cacheType
        )}
        btnProps={{
          isResetBtn: false,
          isSubmitBtn: false
        }}
        rowNum={1}
        formItemProps={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }}
      />
    </CommonDrawer>
  );
};
export default EditDynamicDbDrawer;
