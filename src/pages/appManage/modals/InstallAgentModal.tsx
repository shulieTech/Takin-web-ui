import React, { Fragment, useEffect, useRef } from 'react';
import {
  CommonForm,
  CommonModal,
  CommonSelect,
  CommonTable,
  useStateReducer
} from 'racc';
import { Collapse, Divider, Icon, Input, message, Select } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { FormDataType } from 'racc/dist/common-form/type';
import AppManageService from '../service';
import AddAgentModal from './AddAgentModal';
import CustomAlert from 'src/common/custom-alert/CustomAlert';

interface Props {
  btnText?: string | React.ReactNode;
  onSccuess?: () => void;
  applicationName: string;
  agentId: string;
  type: number;
  applicationId: string;
  disabled?: boolean;
}

const { Option } = Select;
interface State {
  isReload?: boolean;
  form: any;
  agentVersionList: any[];
  isOpen: boolean;
}
const InstallAgentModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    form: null as WrappedFormUtils,
    agentVersionList: null,
    isOpen: false
  });
  const selectRef = useRef<Select>(null);

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'applicationName',
        label: '应用名称',
        options: {
          initialValue: props.applicationName
        },
        node: <Input disabled />
      },
      {
        key: 'agentId',
        options: {
          initialValue: props.agentId
        },
        label: 'AgentID',
        node: <Input disabled />
      },
      {
        key: 'probeId',
        options: {
          initialValue: undefined,
          rules: [
            {
              required: true,
              message: '请选择探针版本'
            }
          ]
        },
        label: '探针版本',
        node: (
          <Select
            placeholder="请选择探针版本"
            ref={selectRef}
            open={state.isOpen}
            onFocus={() => {
              setState({
                isOpen: true
              });
            }}
            onBlur={() => {
              setState({ isOpen: false });
            }}
            onSelect={() => {
              selectRef.current.blur();
              setState({
                isOpen: false
              });
            }}
            dropdownRender={menu => (
              <div>
                <span
                  onMouseDown={e => e.preventDefault()}
                  style={{ padding: 8 }}
                >
                  <AddAgentModal
                    btnText="新增探针版本"
                    onSuccess={() => queryAgentVersionList()}
                  />
                </span>
                {menu}
              </div>
            )}
          >
            {state.agentVersionList &&
              state.agentVersionList.map((item, k) => {
                return (
                  <Option key={k} value={item.value}>
                    {item.label}
                  </Option>
                );
              })}
          </Select>
        )
      }
    ];
  };

  const handleClick = () => {
    queryAgentVersionList();
  };

  /**
   * @name 获取探针版本列表
   */
  const queryAgentVersionList = async () => {
    const {
      data: { data, success }
    } = await AppManageService.queryAgentVersionList({});
    if (success) {
      setState({
        agentVersionList:
          data &&
          data.map((item, k) => {
            return { label: item.version, value: item.id };
          })
      });
    }
  };

  const handleCancle = () => {
    setState({});
  };

  /**
   * @name 安装升级探针
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
        } = await AppManageService.actionAgent({
          ...values,
          operateType: props.type,
          applicationId: props.applicationId
        });
        if (success) {
          message.success(`正在${props.type === 1 ? '安装' : '升级'},请稍后……`);
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
        title: props.type === 1 ? '安装探针' : '升级探针',
        maskClosable: false
      }}
      btnProps={{
        type: 'link',
        disabled: props.disabled ? true : false
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <CustomAlert
        style={{ marginBottom: 16 }}
        showIcon
        types={props.type === 1 ? 'warning' : 'info'}
        message
        content={
          props.type === 1
            ? '该节点未安装探针，请及时处理安装  |  安装预计5-10分钟，超时请联系移动云技术专员'
            : '升级预计5-10分钟，若超时请联系移动云技术专员'
        }
      />
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
export default InstallAgentModal;
