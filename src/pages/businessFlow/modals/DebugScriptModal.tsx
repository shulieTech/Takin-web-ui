/**
 * @name
 * @author chuxu
 */
import { Input, InputNumber, message, Radio } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import { CommonModelState } from 'src/models/common';
import { router } from 'umi';
import BusinessFlowService from '../service';

interface Props extends CommonModelState {
  id: string;
  btnText: string;
  onSuccess: () => void;
  state?: any;
  setState?: (value) => void;
  scriptDeployId?: string;
}
const DebugScriptModal: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    machineId: undefined,
    machineList: [],
  });
  const { id, scriptDeployId } = props;
  const text = '脚本调试';

  /**
   * @name 查询启动机器列表
   */
  const queryTestMachine = async () => {
    const {
      data: { data, success },
      } = await BusinessFlowService.queryTestMachine({ });
    if (success) {
      let defaultMachine = undefined;
      const list = data.list || [{ type: 1, id: 2, name: 'k8s_name_1' }, { type: 0, id: 1, name: 'k8s_name_2' }];
      if (data.lastStartMachineId && list.some(y => y.id === data.lastStartMachineId)) {
        // 使用上次启动的机器
        defaultMachine = data.lastStartMachineId;
      } else if (list.find(x => x.type === 1)) {
        // 使用私网机器
        defaultMachine = list.find(x => x.type === 1 && !x.disabled)?.id;
      } else {
        // 使用公网机器
        defaultMachine = list.find(x => x.type === 0  && !x.disabled)?.id;
      }
      setState({
        machineId: defaultMachine,
        machineList: list,
      });
    }
  };

  const handleSubmit = () => {
    return new Promise(async (resolve) => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        if (Number(values.concurrencyNum) > Number(values.requestNum)) {
          message.info('并发数不能大于请求数');
          resolve(false);
          return;
        }

        props.setState({
          isShowDebugModal: true,
        });
        resolve(true);

        // 开始调试
        const {
          data: { success, data, error },
        } = await BusinessFlowService.startDebug({
          ...values,
          scriptDeployId,
        });
        if (success) {
          if (!data.scriptDebugId) {
            props.setState({
              errorInfo: data.errorMessages,
              debugStatus: 5,
            });
            return;
          }

          props.setState({
            scriptDebugId: data.scriptDebugId,
            debugStatus: 0,
          });
          startDebug(data.scriptDebugId);
        }
      });
    });
  };

  /**
   * @name 开启调试
   */
  const startDebug = async (scriptDebugId) => {
    const {
      data: { data, success },
    } = await BusinessFlowService.queryScriptDebugDetail({ scriptDebugId });
    if (success && data.status === 5 && data.failedType >= 20) {
      router.push(`/scriptManage/scriptDebugDetail?id=${scriptDebugId}`);
      return;
    }
    if (success && data.status === 5) {
      props.setState({
        errorInfo: [data.remark],
        debugStatus: data.status,
      });
      return;
    }
    if (success && data.status === 4) {
      props.setState({
        debugStatus: data.status,
      });
      setTimeout(() => {
        router.push(`/scriptManage/scriptDebugDetail?id=${scriptDebugId}`);
      }, 200);
      return;
    }
    props.setState({
      debugStatus: data.status,
    });
    setTimeout(() => {
      startDebug(scriptDebugId);
    }, 500);
  };

  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'requestNum',
        label: '调试请求条数',
        options: {
          initialValue: '1',
          rules: [
            {
              required: true,
              message: '请选择调试请求条数',
            },
          ],
        },
        node: (
          <CommonSelect
            dataSource={[
              { label: '1', value: '1' },
              { label: '10', value: '10' },
              { label: '100', value: '100' },
              { label: '1000', value: '1000' },
              { label: '10000', value: '10000' },
            ]}
          />
        ),
      },
      {
        key: 'concurrencyNum',
        label: '并发数',
        options: {
          initialValue: '1',
          rules: [
            {
              required: true,
              message: '请选择并发数',
            },
          ],
        },
        node: (
          <CommonSelect
            dataSource={[
              { label: '1', value: '1' },
              { label: '5', value: '5' },
              { label: '10', value: '10' },
              { label: '20', value: '20' },
              { label: '50', value: '50' },
              { label: '100', value: '100' },
            ]}
          />
        ),
      },
      {
        key: 'machineId',
        label: '压力机',
        options: {
          rules: [
            {
              required: true,
              message: '请选择压力机',
            },
          ],
        },
        node: (
          <Radio.Group>
            {state.machineList?.map((x) => (
              <Radio key={x.id} value={x.id} disabled={!!x.disabled}>
                ({{ 0: '公', 1: '私' }[x.type]}网){x.name}
              </Radio>
            ))}
          </Radio.Group>
        ),
      },
    ];
  };

  useEffect(() => {
    state?.form?.setFieldsValue({
      machineId: state.machineId,
    });
  }, [state.machineId, state.form]);

  return (
    <CommonModal
      beforeOk={handleSubmit}
      modalProps={{
        title: text,
        width: 720,
        destroyOnClose: true,
        okText: '开始调试',
      }}
      btnText={props.btnText}
      btnProps={{ type: 'default' }}
      onClick={queryTestMachine}
    >
      <CustomAlert
        message
        types="info"
        showIcon
        content="请在系统承受能力范围内选择并发数"
        style={{ marginBottom: 20 }}
      />
      <CommonForm
        rowNum={1}
        formItemProps={{ labelCol: { span: 4 }, wrapperCol: { span: 14 } }}
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={(form) => setState({ form })}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(DebugScriptModal);
