import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonDrawer, CommonForm, useStateReducer } from 'racc';
import React from 'react';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import { DbDetailBean } from '../enum';
import AppManageService from '../service';
import getAddDynamicDbFormData from './AddDynamicDbFormData';

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
  detailData: any;
  middleWareType: any[];
  middleWareNameData: any[];
}

const getInitState = () => ({
  form: null as WrappedFormUtils,
  middleWareName: undefined, // 中间件名称
  dsType: undefined, // 隔离方案
  dbType: undefined, // 类型
  cacheType: undefined, // 缓存类型
  typeRadioData: [], // 隔离方案枚举数据
  templateData: [],
  dbAndTableList: [],
  middleWareType: [],
  middleWareNameData: [],
  cacheTypeData: [], // 缓存模式
  dbTableDetail: {} as any
});
export type AddDynamicDbDrawerState = ReturnType<typeof getInitState>;
const AddDynamicDbDrawer: React.FC<Props> = props => {
  const { action, id, titles } = props;
  const [state, setState] = useStateReducer(getInitState());

  const handleClick = async () => {
    // queryDbTableDetail();
    // queryType();
    queryMiddleWareType();
  };

  const handleCancle = async () => {
    setState({
      form: null as WrappedFormUtils,
      middleWareName: undefined, // 中间件名称
      dsType: undefined, // 隔离方案
      dbType: undefined, // 类型
      cacheType: undefined, // 缓存类型
      typeRadioData: [], // 隔离方案枚举数据
      templateData: [],
      dbAndTableList: [],
      middleWareType: [],
      middleWareNameData: [],
      cacheTypeData: [], // 缓存模式
      dbTableDetail: {} as any
    });
  };

  /**
   * @name 获取中间件类型
   */
  const queryMiddleWareType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMiddleWareType({});
    if (success) {
      setState({
        middleWareType: data || []
      });
    }
  };

  /**
   * @name 获取中间件类型
   */
  const queryCacheType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryCacheType({});
    if (success) {
      setState({
        cacheTypeData: data || []
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
      beforeOk={() => handleSubmit()}
      onClick={() => handleClick()}
      afterCancel={() => handleCancle()}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getAddDynamicDbFormData(
          state,
          action,
          setState,
          props.detailData,
          props.middlewareType
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
export default AddDynamicDbDrawer;
