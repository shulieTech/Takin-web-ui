import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from './../index.less';
import DataSourceConfigService from '../service';
import getAddDataSourceConfigFormData from '../components/DataSourceConfigFormData';

interface Props {
  btnText?: string | React.ReactNode;
  datasourceId?: number | string;
  onSccuess?: () => void;
  action?: string;
  dictionaryMap?: any;
}

interface State {
  isReload?: boolean;
  form: any;
  debugStatus: boolean;
  detailData: any;
  debugPassed: boolean;
  loading: boolean;
  info: string;
}
const AddDataSourceConfigModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    form: null as WrappedFormUtils,
    debugStatus: false, // 是否调试过
    detailData: null,
    debugPassed: null, // 调试后是否通过
    loading: false,
    info: '保存前请先测试连接有效性'
  });
  const { datasourceId, action, dictionaryMap } = props;

  const handleClick = () => {
    if (action === 'edit') {
      queryDataSourceConfigDetail();
    }
  };

  /**
   * @name 获取数据源配置详情
   */
  const queryDataSourceConfigDetail = async () => {
    const {
      data: { data, success }
    } = await DataSourceConfigService.queryDataSourceConfigDetail({
      datasourceId
    });
    if (success) {
      setState({
        detailData: data
      });
    }
  };

  const handleCancle = () => {
    setState({
      debugStatus: false,
      debugPassed: null,
      loading: false,
      info: '保存前请先测试连接有效性'
    });
  };

  /**
   * @name 新增表单
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        if (!state.debugStatus || !state.debugPassed) {
          message.error('保存前请先调试成功！');
          resolve(false);
          return false;
        }

        if (action === 'edit') {
          const {
            // tslint:disable-next-line:no-shadowed-variable
            data: { success, data }
          } = await DataSourceConfigService.editDataSourceConfig({
            datasourceId,
            ...values
          });
          if (success) {
            message.success('操作成功');
            props.onSccuess();
            resolve(true);
            return;
          }
          resolve(false);
          return;
        }

        const {
          data: { success, data }
        } = await DataSourceConfigService.addDataSourceConfig({
          ...values
        });
        if (success) {
          message.success('操作成功');
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
        width: 600,
        title: action === 'edit' ? '编辑数据源' : '新增数据源',
        maskClosable: false
      }}
      btnProps={{ type: action === 'edit' ? 'link' : 'primary' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getAddDataSourceConfigFormData(
            state,
            setState,
            action,
            dictionaryMap
          )}
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
export default AddDataSourceConfigModal;
