import React, { useState, useContext, useMemo } from 'react';
import { Modal } from 'antd';
import { Form, FormItem, createAsyncFormActions } from '@formily/antd';
import { Input, Select, Radio } from '@formily/antd-components';
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
    // TODO 提交数据
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
        labelCol={6}
        wrapperCol={18}
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
          name="topic"
          title="业务的topic"
          component={Input}
          rules={[
            {
              required: true,
              whitespace: true,
              message: '请输入业务的topic#业务的消费组',
            },
          ]}
          props={{ maxLength: 200, whitespace: true, placeholder: '请输入' }}
        />
        <FormItem
          name="isConsumed"
          title="是否消费"
          component={Radio.Group}
          rules={[
            { required: true, message: '请选择是否消费' },
          ]}
          dataSource={[
            { label: '不消费影子topic', value: 0 },
            { label: '消费影子topic', value: 1 },
          ]}
          initialValue={0}
        />
      </Form>
    </Modal>
  );
};
