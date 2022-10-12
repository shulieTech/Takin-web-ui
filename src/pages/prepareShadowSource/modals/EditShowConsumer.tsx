import React, { useState, useContext, useMemo } from 'react';
import { message, Modal } from 'antd';
import {
  Form,
  FormItem,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Input, Select, Radio, NumberPicker } from '@formily/antd-components';
import service from '../service';
import { PrepareContext } from '../_layout';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
  mqTypeList: any[];
}

export default (props: Props) => {
  const { detail, okCallback, cancelCallback, mqTypeList, ...rest } = props;
  const actions = useMemo(createAsyncFormActions, []);

  const { prepareState, setPrepareState } = useContext(PrepareContext);

  const handleSubmit = async () => {
    const { values } = await actions.submit();
    const newValue = {
      ...detail,
      ...values,
      resourceId: prepareState.currentLink.id,
    };
    const {
      data: { data, success },
    } = await service[detail.id ? 'updateShdowConsumer' : 'createShdowConsumer'](newValue);
    if (success) {
      message.success('操作成功');
      cancelCallback();
      okCallback();
    }
  };

  const formEffects = () => {
    const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks;
    onFieldValueChange$('mqType').subscribe(({ value }) => {
      const isKafka = value === 'KAFKA';
      actions.setFieldState(
        'consumerTag',
        (state) => (state.visible = !isKafka)
      );
      actions.setFieldState(
        '*(isCluster,comsumerType)',
        (state) => (state.visible = isKafka)
      );
    });
    onFieldValueChange$('isCluster').subscribe(({ value }) => {
      actions.setFieldState(
        'mqConsumerFeature.*',
        (state) => (state.visible = value === 0)
      );
    });
  };

  return (
    <Modal
      title={`${detail?.id ? '编辑' : '新增'}影子消费者`}
      width={600}
      visible={!!detail}
      onOk={handleSubmit}
      okText="保存"
      onCancel={cancelCallback}
      maskClosable={false}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
      destroyOnClose
      {...rest}
    >
      <Form
        actions={actions}
        initialValues={detail}
        labelCol={8}
        wrapperCol={16}
        effects={formEffects}
      >
        <FormItem
          name="mqType"
          title="MQ类型"
          component={Select}
          dataSource={mqTypeList}
          props={{
            placeholder: '请选择',
          }}
          rules={[{ required: true, message: '请选择MQ类型' }]}
        />
        <FormItem
          name="comsumerType"
          title="生产/消费"
          visible={false}
          component={Select}
          dataSource={[
            { label: '生产', value: 0 },
            { label: '消费', value: 1 },
          ]}
          props={{
            placeholder: '请选择',
          }}
          rules={[{ required: true, message: '请选择生产/消费' }]}
          initialValue={1}
        />
        <FormItem
          name="topicGroup"
          title="业务的topic"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入业务的topic#业务的消费组',
            },
            {
              validator: (val) => {
                return !val ||
                  (typeof val === 'string' &&
                    val.length > 0 &&
                    val.indexOf('#') > -1)
                  ? ''
                  : '业务的topic#业务的消费组请以#分割';
              },
            },
          ]}
          props={{
            maxLength: 25,
            placeholder: '请输入业务的topic#业务的消费组',
          }}
        />

        <FormItem
          name="consumerTag"
          title="是否消费"
          component={Radio.Group}
          rules={[{ required: true, message: '请选择是否消费' }]}
          dataSource={[
            { label: '不消费影子topic', value: 1 },
            { label: '消费影子topic', value: 0 },
          ]}
          initialValue={1}
        />
        <FormItem
          name="isCluster"
          title="是否影子集群"
          visible={false}
          component={Radio.Group}
          rules={[{ required: true, message: '请选择是否影子集群' }]}
          dataSource={[
            { label: '否', value: 1 },
            { label: '是', value: 0 },
          ]}
          initialValue={1}
        />
        <FormItem
          name="mqConsumerFeature.clusterName"
          title="影子集群名称"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入影子集群名称',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入影子集群名称（多个用逗号隔开）',
          }}
          visible={false}
        />
        <FormItem
          name="mqConsumerFeature.clusterAddr"
          title="影子集群地址"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入影子集群地址',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入影子集群地址（多个用逗号隔开）',
          }}
          visible={false}
        />
        <FormItem
          name="mqConsumerFeature.threadCount"
          title="影子生产使用消费线程数"
          component={NumberPicker}
          rules={[
            {
              // required: true,
              format: 'integer',
              message: '请输入正确的影子生产使用消费线程数',
            },
          ]}
          props={{
            placeholder: '请输入影子生产使用消费线程数',
            style: { width: '100%' },
            min: 0,
          }}
          visible={false}
        />
      </Form>
    </Modal>
  );
};
