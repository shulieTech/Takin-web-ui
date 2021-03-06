import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import DistributionService from './service';
import { FormDataType } from 'racc/dist/common-form/type';

interface Props {
  btnText?: string | React.ReactNode;
  onSuccess?: () => void;
  businessActivityId?: string;
}

interface State {
  agentList: any;
  form: any;
  agentData: any;
  loading: boolean;
}
const AddTenantModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    agentList: null,
    form: null as WrappedFormUtils,
    agentData: null,
    loading: false
  });

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'nick',
        label: '客户名称',
        options: {
          rules: [
            { required: true, message: '请输入客户名称', whitespace: true }
          ]
        },
        node: <Input placeholder="请输入客户名称" />
      },
      {
        key: 'status',
        label: '客户类型',
        options: {
          rules: [{ required: true, message: '请选择客户类型' }]
        },
        node: (
          <CommonSelect
            placeholder="请选择客户类型"
            dataSource={[
              { label: '正式', value: 1 },
              { label: '试用', value: 2 }
            ]}
            onRender={item => (
              <CommonSelect.Option key={item.value} value={item.value}>
                {item.label}
              </CommonSelect.Option>
            )}
          />
        )
      },
      {
        key: 'code',
        label: '租户code',
        options: {
          rules: [
            {
              required: true,
              message: '请输入租户code（只支持英文）',
              whitespace: true,
              validator: checkData
            }
          ]
        },
        node: <Input placeholder="请输入英文" />
      }
    ];
  };

  // 自定义校验方法， 输入框不能输入汉字
  const checkData = async (rule, value, callback) => {
    if (value) {
      if (/[^a-zA-Z]/g.test(value)) {
        callback(new Error('只可输入英文'));
      }
    } else {
      callback(new Error('请输入租户code（只支持英文）'));
    }
  };

  const handleCancle = () => {
    setState({
      agentList: null
    });
  };

  /**
   * @name 新增租户
   */
  const handleSubmit = async () => {
    return await new Promise(resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.error('请检查表单必填项');
          resolve(false);
          return false;
        }
        const {
          data: { data, success }
        } = await DistributionService.addTenant({
          ...values
        });
        if (success) {
          message.success(
            '客户新增成功，默认密码：shulie@2021，请登录后更改密码您的密码！'
          );
          props.onSuccess();
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 600,
        title: '新增租户',
        maskClosable: false
      }}
      btnText={props.btnText}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ position: 'relative' }}>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getFormData()}
          btnProps={{
            isResetBtn: false,
            isSubmitBtn: false
          }}
          rowNum={1}
        />
      </div>
    </CommonModal>
  );
};
export default AddTenantModal;
