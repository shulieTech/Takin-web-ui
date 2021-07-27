import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Icon, Input, message, Tooltip } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import AppManageService from '../service';
import { connect } from 'dva';
import copy from 'copy-to-clipboard';
interface Props {
  btnText?: string | React.ReactNode;
  onSccuess?: () => void;
  dictionaryMap?: any;
  id: string;
  type: string;
  interfaceName: string;
  interfaceType: string;
  applicationId: string;
  serverAppName: string;
}

interface State {
  isReload?: boolean;
  form: any;
  configType: string;
  detail: any;
  configTypeData: any;
  configValue: string;
}
const MockConfigModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    form: null as WrappedFormUtils,
    configType: undefined,
    detail: {},
    configTypeData: null,
    configValue: null
  });
  const { dictionaryMap } = props;
  const { REMOTE_CALL_CONFIG_TYPE, REMOTE_CALL_TYPE } = dictionaryMap;
  const handleChangeConfigType = value => {
    setState({
      configType: value
    });
    state.form.setFieldsValue({
      mockReturnValue: null
    });
  };

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  /**
   * @name 获取挡板模板
   */
  const getBaffleConfig = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryConfig({
      configCode: 'PRADAR_GUARD_TEMPLATE'
    });
    if (success) {
      setState({
        configValue: data
      });
    }
  };

  const getFormData = (): FormDataType[] => {
    const basicFormData = [
      {
        key: 'interfaceName',
        label: '接口名称',
        options: {
          initialValue: props.interfaceName
        },
        node: <Input.TextArea autoSize disabled />
      },
      {
        key: 'interfaceType',
        options: {
          initialValue: props.interfaceType
        },
        label: '接口类型',
        node: (
          <CommonSelect
            disabled
            placeholder="请选择接口类型"
            dataSource={REMOTE_CALL_TYPE || []}
          />
        )
      },
      {
        key: 'type',
        options: {
          initialValue: props.type,
          rules: [
            {
              required: true,
              message: '请选择配置类型'
            }
          ]
        },
        label: '配置类型',
        node: (
          <CommonSelect
            placeholder="请选择配置类型"
            dataSource={state.configTypeData || []}
            onChange={handleChangeConfigType}
            onRender={item => (
              <CommonSelect.Option
                key={item.value}
                value={item.value}
                disabled={!item.disable}
              >
                {item.label}
              </CommonSelect.Option>
            )}
          />
        )
      }
    ];

    const mockFormData = [
      {
        key: 'mockReturnValue',
        options: {
          initialValue: state.detail.mockReturnValue,
          rules: [
            {
              required: true,
              message: `请输入${
                state.configType === '3' ? 'URL' : '返回值mock'
              }`
            }
          ]
        },
        label:
          state.configType === '3' ? (
            'URL'
          ) : (
            <Tooltip
              title={() => {
                return (
                  <div>
                    <div style={{ textAlign: 'right' }}>
                      <a onClick={() => handleCopy(state.configValue)}>复制</a>
                    </div>
                    <div
                      style={{ width: 250, height: 400, overflow: 'scroll' }}
                    >
                      {state.configValue}
                    </div>
                  </div>
                );
              }}
            >
              <span style={{ fontSize: 14 }}>返回值mock</span>
              <Icon style={{ marginLeft: 4 }} type="question-circle" />
            </Tooltip>
          ),
        node: <Input.TextArea />
      }
    ];

    if (state.configType === '2' || state.configType === '3') {
      return basicFormData.concat(mockFormData);
    }
    return basicFormData;
  };

  const handleClick = () => {
    getConfigType();
    getBaffleConfig();
    if (props.id) {
      getMockDetail();
    }
  };

  const handleCancle = () => {
    setState({});
  };

  /**
   * @name 获取远程调用详情
   */
  const getMockDetail = async () => {
    const {
      data: { data, success }
    } = await AppManageService.getMockDetail({ id: props.id });
    if (success) {
      setState({
        detail: data,
        configType: props.type
      });
    }
  };
  /**
   * @name 获取远程接口配置类型
   */
  const getConfigType = async () => {
    const {
      data: { data, success }
    } = await AppManageService.getConfigType({
      interfaceType: props.interfaceType,
      serverAppName: props.serverAppName
    });
    if (success) {
      setState({
        configTypeData: data
      });
    }
  };
  /**
   * @name Mock配置
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
        } = await AppManageService.configMock({
          ...values,
          id: props.id,
          applicationId: props.applicationId,
          serverAppName: props.serverAppName
        });
        if (success) {
          message.success('操作成功');
          props.onSccuess();
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
        title: '编辑配置',
        maskClosable: false
        // centered: true
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
export default connect(({ common }) => ({ ...common }))(MockConfigModal);
