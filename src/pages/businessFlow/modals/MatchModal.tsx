import React, { Fragment, useEffect, useRef } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Input, message, Radio, Select } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import BusinessFlowService from '../service';

interface Props {
  btnText?: string | React.ReactNode;
  apiName: string;
  path: string;
  isVirtual: string;
  entranceApp: string;
  entrancePath: string;
  samplerType: string;
  rowDetail: any;
  onSuccess: () => void;
  businessFlowId: string;
}

interface State {
  isReload?: boolean;
  form: any;
  entryAppList: any;
  entryPathList: any;
  applicationName: string;
  entrancePath: any;
  isVirtual: string;
  businessActivityName: string;
  businessActivityId: string;
}
const MatchModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    form: null as WrappedFormUtils,
    entryAppList: null,
    entryPathList: null,
    applicationName: undefined, // 选择的入口应用
    entrancePath: undefined, // 选择的入口path
    isVirtual: undefined,
    businessActivityName: undefined,
    businessActivityId: undefined
  });

  useEffect(() => {
    setState({
      applicationName: props.entranceApp,
      entrancePath: props.entrancePath,
      isVirtual: props.isVirtual === '1' ? '1' : '0'
    });
  }, []);

  useEffect(() => {
    if (props.entranceApp && props.entrancePath) {
      queryBusinessActivityName(props.entranceApp, props.entrancePath);
      queryEntryPath(props.entranceApp);
    }
  }, []);

  /**
   * @name 选择入口应用
   */
  const handleChangeEntranceApp = value => {
    setState({
      applicationName: value,
      entrancePath: undefined,
      businessActivityName: undefined,
      businessActivityId: undefined
    });
    state.form.setFieldsValue({
      entrance: undefined
    });
    queryEntryPath(value);
  };

  const handleChangeBusinessType = e => {
    setState({
      isVirtual: e.target.value,
      applicationName: undefined,
      entrancePath: undefined,
      businessActivityName: undefined,
      businessActivityId: undefined
    });
    state.form.setFieldsValue({
      applicationName: undefined,
      entrance: undefined
    });
  };
  /**
   * @name 选择入口path
   */
  const handleChangeEntrancePath = value => {
    setState({
      entrancePath: value
    });
    queryBusinessActivityName(state.applicationName, value);
  };

  const basicFormData = [
    {
      key: 'apiName',
      label: 'API名称',
      options: {
        initialValue: props.apiName,
        rules: [
          {
            required: true,
            message: '请输入API名称'
          }
        ]
      },
      node: <Input disabled />
    },
    {
      key: 'path',
      options: {
        initialValue: props.path,
        rules: [
          {
            required: true,
            message: '请输入请求path'
          }
        ]
      },
      label: '请求path',
      node: <Input disabled />
    },
    {
      key: 'businessType',
      options: {
        initialValue: props.isVirtual === '1' ? '1' : '0',
        rules: [
          {
            required: true,
            message: '请选择是否虚拟业务活动'
          }
        ]
      },
      label: '是否虚拟业务活动',
      node: (
        <Radio.Group onChange={handleChangeBusinessType}>
          <Radio value="0">否</Radio>
          <Radio value="1">是</Radio>
        </Radio.Group>
      )
    }
  ];

  const businessFormData = [
    {
      key: 'applicationName',
      options: {
        initialValue: props.entranceApp,
        rules: [
          {
            required: true,
            message: '请选择入口应用'
          }
        ]
      },
      label: '入口应用',
      node: (
        <CommonSelect
          dataSource={state.entryAppList || []}
          placeholder="请选择入口应用"
          onChange={handleChangeEntranceApp}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    },
    {
      key: 'entrance',
      options: {
        initialValue: props.entrancePath,
        rules: [
          {
            required: true,
            message: '请选择入口path'
          }
        ]
      },
      label: '入口path',
      node: (
        <CommonSelect
          dataSource={state.entryPathList || []}
          placeholder="请选择入口path"
          onChange={value => handleChangeEntrancePath(value)}
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        />
      )
    },
    {
      key: 'activityName',
      options: {
        initialValue:
          state.applicationName &&
          state.entrancePath &&
          !state.businessActivityName
            ? props.apiName
            : state.businessActivityName
      },
      label: '业务活动名称',
      node: (
        <Input
          placeholder="请输入业务活动名称"
          disabled={state.businessActivityName ? true : false}
        />
      )
    }
  ];

  const getFormData = (): FormDataType[] => {
    if (state.isVirtual === '0') {
      return basicFormData.concat(businessFormData as any);
    }
    return basicFormData;
  };

  const handleClick = () => {
    queryEntryApp();
  };

  /**
   * @name 获取入口应用
   */
  const queryEntryApp = async () => {
    const {
      data: { data, success }
    } = await BusinessFlowService.queryEntryApp({});
    if (success) {
      setState({
        entryAppList: data
      });
    }
  };

  /**
   * @name 获取入口path
   */
  const queryEntryPath = async applicationName => {
    const {
      data: { data, success }
    } = await BusinessFlowService.queryEntryPath({
      applicationName,
      samplerType: props.samplerType
    });
    if (success) {
      setState({
        entryPathList: data
      });
    }
  };

  /**
   * @name 获取业务活动名称
   */
  const queryBusinessActivityName = async (applicationName, entrancePath) => {
    const {
      data: { data, success }
    } = await BusinessFlowService.queryBusinessActivityName({
      applicationName,
      entrancePath
    });
    if (success) {
      if (data && data[0]) {
        setState({
          businessActivityName: data && data[0] && data[0].activityName,
          businessActivityId: data && data[0] && data[0].activityId
        });
        return;
      }
      state.form.setFieldsValue({
        businessActivityName: props.apiName
      });
    }
  };

  const handleCancle = () => {
    setState({});
  };

  /**
   * @name 确认匹配
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
          data: { success, data }
        } = await BusinessFlowService.confirmMatch({
          ...props.rowDetail,
          ...values,
          businessActivityId: state.businessActivityId,
          businessFlowId: props.businessFlowId
        });
        if (success) {
          resolve(true);
          props.onSuccess();
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
        title: '匹配业务活动',
        maskClosable: false,
        okText: '确认匹配'
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div>
        <CommonForm
          getForm={form => setState({ form })}
          formData={getFormData()}
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
export default MatchModal;
