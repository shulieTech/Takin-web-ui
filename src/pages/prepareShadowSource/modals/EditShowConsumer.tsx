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
import useApplicationSelect from './useApplicationSelect';

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

  const [topicLabel, setTopicLabel] = useState('业务'); // 例如KAFKA-其他 label名叫影子的topic，其他情况叫业务的topic

  const selectAppOptions = useApplicationSelect(detail);

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
    const { onFieldValueChange$, onFieldInputChange$, onFormValuesChange$ } =
      FormEffectHooks;

    onFieldValueChange$('*(mqType, comsumerType)').subscribe(() => {
      // 影子集群配置
      actions.getFormState((formState) => {
        const { mqType, comsumerType } = formState.values || {};
        // kafka/kafka其他 生产者不显示group
        actions.setFieldState('group', state => {
          state.visible = !(['KAFKA', 'KAFKA-其他'].includes(mqType) && comsumerType === 0);
        });
        // 是否消费
        actions.setFieldState(
          'consumerTag',
          (state) =>
            (state.visible = !(
              ['KAFKA', 'KAFKA-其他'].includes(mqType) && comsumerType === 0
            ))
        );
        // 生产/消费/自产自销
        actions.setFieldState('comsumerType', (state) => {
          state.visible = ['KAFKA', 'KAFKA-其他'].includes(mqType);
          state.props.dataSource =
            mqType === 'KAFKA-其他'
              ? [
                  { label: '生产', value: 0 },
                  { label: '消费', value: 1 },
                  { label: '自产自销', value: 2 },
              ]
              : [
                  { label: '生产', value: 0 },
                  { label: '消费', value: 1 },
              ];
        });

        // 是否影子集群
        actions.setFieldState('isCluster', (state) => {
          state.visible = ['KAFKA-其他'].includes(mqType);
        });

        actions.setFieldState('topicTokens', (state) => {
          state.visible =
            ['KAFKA-其他'].includes(mqType) && [0, 2].includes(comsumerType); // 其他，生产者/自产自销
        });
        actions.setFieldState('systemIdToken', (state) => {
          state.visible =
            ['KAFKA-其他'].includes(mqType) && [1, 2].includes(comsumerType); // 其他，消费者/自产自销
        });
        setTopicLabel(['KAFKA-其他'].includes(mqType) ? '影子' : '业务');
      });
    });

    onFieldValueChange$('*(mqType, comsumerType, isCluster)').subscribe(() => {
      actions.getFormState((formState) => {
        const { mqType, comsumerType, isCluster } = formState.values || {};
        // brokerUrl
        actions.setFieldState('brokerUrl', (state) => {
          state.visible =
            (['KAFKA'].includes(mqType) && [0].includes(comsumerType)) || // kafka，生产者
            (['KAFKA-其他'].includes(mqType) && // 其他，生产者，非影子集群
              [0].includes(comsumerType) &&
              isCluster === 1);
        });
        actions.setFieldState(
          '*(mqConsumerFeature.clusterName, mqConsumerFeature.clusterAddr)',
          (state) => {
            state.visible = isCluster === 0;
          }
        );
        actions.setFieldState(
          'mqConsumerFeature.providerThreadCount',
          (state) => {
            state.visible = isCluster === 0 && [0, 2].includes(comsumerType);
          }
        );
        actions.setFieldState(
          'mqConsumerFeature.consumerThreadCount',
          (state) => {
            state.visible = isCluster === 0 && [1, 2].includes(comsumerType);
          }
        );
      });
    });

    // onFieldValueChange$('isCluster').subscribe(({ value }) => {
    //   // 影子集群配置
    //   actions.setFieldState(
    //     'mqConsumerFeature.*',
    //     (state) => (state.visible = value === 0)
    //   );
    // });
    onFieldInputChange$('mqType').subscribe(({ value }) => {
      actions.setFieldState(
        'comsumerType',
        (state) => (state.value = undefined)
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
          name="applicationId"
          title="应用范围"
          component={Select}
          {...selectAppOptions}
        />
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
          // visible={false}
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
          name="topic"
          title={`${topicLabel}的topic`}
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: `请输入${topicLabel}的topic`,
            },
          ]}
          props={{
            maxLength: 50,
            placeholder: `请输入${topicLabel}的topic`,
          }}
        />
        <FormItem
          name="group"
          title={`${topicLabel}的消费组`}
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: `请输入${topicLabel}的消费组`,
            },
          ]}
          props={{
            maxLength: 50,
            placeholder: `请输入${topicLabel}的消费组`,
          }}
        />
        <FormItem
          name="brokerUrl"
          title="broker地址"
          visible={false}
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入broker地址',
            },
          ]}
          props={{
            maxLength: 200,
            placeholder: '请输入broker地址（多个用逗号隔开）',
          }}
        />
        <FormItem
          name="topicTokens"
          title="topicTokens"
          visible={false}
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入topicTokens',
            },
          ]}
          props={{
            maxLength: 50,
            placeholder: '请输入topicTokens',
          }}
        />
        <FormItem
          name="systemIdToken"
          title="systemIdToken"
          visible={false}
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入systemIdToken',
            },
          ]}
          props={{
            maxLength: 50,
            placeholder: '请输入systemIdToken',
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
          name="mqConsumerFeature.providerThreadCount"
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
        <FormItem
          name="mqConsumerFeature.consumerThreadCount"
          title="影子消费使用消费线程数"
          component={NumberPicker}
          rules={[
            {
              // required: true,
              format: 'integer',
              message: '请输入正确的影子消费使用消费线程数',
            },
          ]}
          props={{
            placeholder: '请输入影子消费使用消费线程数',
            style: { width: '100%' },
            min: 0,
          }}
          visible={false}
        />
      </Form>
    </Modal>
  );
};
