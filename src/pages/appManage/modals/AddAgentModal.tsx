import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, ImportFile, useStateReducer } from 'racc';
import { Collapse, Divider, Icon, Input, message, Spin } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
import AppManageService from '../service';
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
const AddAgentModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    agentList: null,
    form: null as WrappedFormUtils,
    agentData: null,
    loading: false
  });

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '文件名',
        dataIndex: 'fileName'
      }
    ];
  };

  const handleImport = async file => {
    // message.loading({ content: '文件上传中，请稍等' });
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await AppManageService.uploadAgent(file);

    if (success) {
      setState({
        loading: false
      });
      message.success('上传文件成功!');
      setState({
        agentList: [data],
        agentData: data
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'appName',
        label: '上传探针包',
        node: (
          <ImportFile
            accept={['gz', 'zip', 'tar']}
            onImport={handleImport}
            UploadProps={{
              type: 'drag',
              multiple: false
            }}
          >
            <p>
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或者拖拽到此上传文件</p>
            <p>支持格式：.gz | .zip | .tar（探针包压缩文件）</p>
          </ImportFile>
        ),
        extra: (
          <div style={{ marginTop: 20 }}>
            <CustomTable
              columns={getColumns()}
              dataSource={state.agentList || []}
            />
          </div>
        )
      }
    ];
  };

  const handleCancle = () => {
    setState({
      agentList: null
    });
  };

  /**
   * @name 新增探针版本
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
        title: '新增探针版本',
        maskClosable: false
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ position: 'relative' }}>
        {state.loading && (
          <span
            style={{
              position: 'absolute',
              top: 50,
              left: 270,
              zIndex: 100
            }}
          >
            <Spin />
          </span>
        )}
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
export default AddAgentModal;
