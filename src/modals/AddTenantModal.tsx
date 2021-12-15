import React, { Fragment, useEffect } from 'react';
import {
  CommonForm,
  CommonModal,
  CommonSelect,
  ImportFile,
  useStateReducer
} from 'racc';
import { Collapse, Divider, Icon, Input, message, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
import Loading from 'src/common/loading';

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
          rules: [{ required: true, message: '请输入客户名称' }]
        },
        node: <Input placeholder="请输入客户名称" />
      },
      {
        key: 'status',
        label: '客户类型',
        options: {
          rules: [{ required: true, message: '请选择客户类型' }]
        },
        node: <CommonSelect placeholder="请选择客户类型" dataSource={[{}]} />
      }
    ];
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
        } = await AppManageService.addAgent({
          probePath: state.agentData && state.agentData.filePath
        });
        if (success) {
          message.success('新增探针包成功!');
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
