/**
 * @name
 * @author MingShined
 */
import { Input, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal, CommonSelect, useStateReducer } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import { ShadowConsumerBean } from '../enum';
import AppManageService from '../service';
interface Props extends CommonModelState {
  id?: string;
  btnText: string;
  onSuccess: () => void;
  applicationId: string;
  action?: string;
  type?: string;
  topicGroup?: string;
  shadowconsumerEnable?: string;
}
const AddEditConsumerModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    form: null as WrappedFormUtils,
    details: {},
    MQType: [],
    MQPlan: [],
    type: undefined
  });
  const { action } = props;

  const text = action === 'edit' ? '编辑' : '新增';
  useEffect(() => {
    if (state.type) {
      queryMQPlan();
    }
  }, [state.type]);
  const handleClick = () => {
    queryMQType();
    getDetails();
  };
  const getDetails = async () => {
    if (action !== 'edit') {
      return;
    }
    setState({
      type: props.type
    });
  };

  /**
   * @name 获取MQ类型
   */
  const queryMQType = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMQType({});
    if (success) {
      setState({
        MQType: data
      });
    }
  };

  /**
   * @name 获取mq隔离方案
   */
  const queryMQPlan = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMQPlan({
      engName: state.type
    });
    if (success) {
      setState({
        MQPlan: data
      });
    }
  };

  const handleChangeMQType = value => {
    setState({
      type: value,
      MQPlan: []
    });
  };
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: ShadowConsumerBean.MQ类型,
        label: 'MQ类型',
        options: {
          initialValue: props.type,
          rules: [{ required: true, message: '请选择MQ类型' }]
        },
        node: (
          <CommonSelect
            placeholder="请选择MQ类型"
            dataSource={state.MQType}
            onChange={handleChangeMQType}
          />
        )
      },
      {
        key: ShadowConsumerBean.groupId,
        options: {
          initialValue: props.topicGroup,
          rules: [{ required: true, message: '请输入业务的topic#业务的消费组' }]
        },
        label: '业务的topic#业务的消费组',
        node: <Input placeholder="请输入业务的topic#业务的消费组" />
      },
      {
        key: ShadowConsumerBean.隔离方案,
        label: '隔离方案',
        options: {
          initialValue: props.shadowconsumerEnable,
          rules: [{ required: true, message: '请选择隔离方案' }]
        },
        node: (
          <CommonSelect
            placeholder="请选择隔离方案"
            dataSource={state.MQPlan}
          />
        )
      }
    ];
  };
  const handleSubmit = () => {
    return new Promise(async resolve => {
      state.form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        if (values[ShadowConsumerBean.groupId].indexOf('#') === -1) {
          message.info('业务的topic#业务的消费组请以#分割');
          resolve(false);
          return;
        }
        const result = {
          applicationId: props.applicationId,
          ...values
        };
        const ajaxEvent =
          action === 'edit'
            ? AppManageService.updateShdowConsumer({
              ...state.details,
              ...result,
              id: props.id
            })
            : AppManageService.createShdowConsumer(result);
        const {
          data: { success }
        } = await ajaxEvent;
        if (success) {
          message.success(`${text}成功`);
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
      beforeOk={handleSubmit}
      modalProps={{ title: text, width: 720, destroyOnClose: true }}
      btnText={props.btnText}
      btnProps={{ type: action === 'edit' ? 'link' : 'primary' }}
      onClick={handleClick}
    >
      <CommonForm
        rowNum={1}
        formItemProps={{ labelCol: { span: 8 }, wrapperCol: { span: 14 } }}
        btnProps={{ isResetBtn: false, isSubmitBtn: false }}
        getForm={form => setState({ form })}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(AddEditConsumerModal);
