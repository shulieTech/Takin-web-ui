import React, { Fragment, useEffect } from 'react';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import AppManageService from '../service';
import { connect } from 'dva';

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

const getInitState = () => ({
  isReload: false,
  form: null as WrappedFormUtils,
  configType: undefined,
  detail: {} as any,
  configTypeData: null,
  mockTypeData: null,
  mockType: undefined
});
export type MockConfigModalState = ReturnType<typeof getInitState>;
const MockConfigModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<MockConfigModalState>(
    getInitState()
  );
  const { detail } = state;

  useEffect(() => {
    if (state.mockType) {
      getConfigType();
    }
  }, [state.mockType]);

  const handleChangeMockType = value => {
    setState({
      mockType: value,
      configTypeData: []
    });
  };

  const getFormData = (): FormDataType[] => {
    const basicFormData = [
      {
        key: 'interfaceName',
        label: '接口名称',
        options: {
          initialValue: props.id ? detail.interfaceName : undefined,
          rules: [
            {
              required: true,
              message: '请输入接口名称'
            }
          ]
        },
        node: (
          <Input.TextArea
            autoSize
            disabled={props.id ? true : false}
            placeholder="请输入接口名称"
          />
        )
      },
      {
        key: 'interfaceType',
        options: {
          initialValue: props.id ? detail.interfaceType : undefined,
          rules: [
            {
              required: true,
              message: '请选择接口类型'
            }
          ]
        },
        label: '接口类型',
        node: (
          <CommonSelect
            disabled={props.id ? true : false}
            placeholder="请选择接口类型"
            dataSource={state.mockTypeData || []}
            onChange={handleChangeMockType}
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          />
        )
      },
      {
        key: 'type',
        options: {
          initialValue: props.id ? String(detail.type) : undefined,
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
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
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
      },
      {
        key: 'mockReturnValue',
        label: '备注',
        options: {
          initialValue: props.id ? detail.mockReturnValue : undefined
        },
        node: <Input.TextArea autoSize placeholder="请输入备注" />
      }
    ];

    return basicFormData;
  };

  const handleClick = () => {
    getMockType();
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
        mockType: data.interfaceType
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
      interfaceType: state.mockType
    });
    if (success) {
      setState({
        configTypeData: data
      });
    }
  };

  /**
   * @name 获取远程接口类型
   */
  const getMockType = async () => {
    const {
      data: { data, success }
    } = await AppManageService.getMockType({});
    if (success) {
      setState({
        mockTypeData: data
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

        if (props.id) {
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
        } else {
          const {
            data: { success, data }
          } = await AppManageService.addMock({
            ...values,
            applicationId: props.applicationId
          });
          if (success) {
            message.success('操作成功');
            props.onSccuess();
            resolve(true);
            return;
          }
        }

        resolve(false);
      });
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 600,
        title: '远程调用配置',
        maskClosable: false
        // centered: true
      }}
      btnProps={{
        type: props.id ? 'link' : 'primary'
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
