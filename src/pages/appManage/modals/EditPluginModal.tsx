import { InputNumber, message, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CommonForm, CommonModal, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { Fragment } from 'react';
import AppManageService from '../service';
interface Props {
  btnText: string;
  configValue: string;
  id: string;
  appId: string;
  onSuccess: () => void;
}
const getInitState = () => ({
  form: null as WrappedFormUtils,
  configValue: null
});
export type EditPluginModalState = ReturnType<typeof getInitState>;
const EditPluginModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<EditPluginModalState>(
    getInitState()
  );
  const handleClick = () => {
    setState({
      configValue: props.configValue === '-1' ? null : props.configValue
    });
  };

  const handleChangeRadio = e => {
    state.form.setFieldsValue({
      configValue: e.target.value
    });
    setState({
      configValue: null
    });
  };

  const handleChangeConfigValue = value => {
    setState({
      configValue: value
    });
  };

  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        if (values.configValue === '1' && !state.configValue) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }

        let result = {
          id: props.id,
          applicationId: props.appId,
          ...values
        };
        if (values.configValue === '1') {
          result = {
            ...result,
            configValue: state.configValue
          };
        }

        delete result.config;

        const {
          data: { success, data }
        } = await AppManageService.editPugin({
          ...result
        });
        if (success) {
          message.success('操作成功');
          props.onSuccess();
          resolve(true);
        }
        resolve(false);
      });
    });
  };
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'config',
        label: '配置项',
        node: <span>redis影子key有效期</span>
      },
      {
        key: 'configValue',
        label: '配置值',
        options: {
          rules: [{ required: true, message: '请选择配置值' }],
          initialValue: props.configValue === '-1' ? '-1' : '1'
        },
        node: (
          <Radio.Group onChange={handleChangeRadio}>
            <Radio value="-1">与业务key一致</Radio>
            <Radio value="1">
              <InputNumber
                min={1}
                precision={0}
                style={{ width: 100 }}
                onChange={handleChangeConfigValue}
                value={state.configValue}
                disabled={
                  state.form && state.form.getFieldValue('configValue') === '-1'
                    ? true
                    : false
                }
              />
              小时
            </Radio>
          </Radio.Group>
        )
      }
    ];
  };
  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={{ title: '编辑插件管理', width: 560, destroyOnClose: true }}
      btnText={props.btnText}
      btnProps={{ type: 'link' }}
      onClick={handleClick}
    >
      <CommonForm
        getForm={form => setState({ form })}
        formData={getFormData()}
        btnProps={{
          isResetBtn: false,
          isSubmitBtn: false
        }}
        rowNum={1}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }}
      />
    </CommonModal>
  );
};
export default EditPluginModal;
