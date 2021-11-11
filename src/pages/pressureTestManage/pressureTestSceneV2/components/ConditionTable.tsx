import React from 'react';
import { SchemaMarkupField as Field } from '@formily/antd';
import { FormBlock, FormLayout, FormTextBox } from '@formily/antd-components';

export default (props) => {
  return (
    <FormLayout labelCol={0} wrapperCol={24}>
      <FormBlock
        title={<span style={{ fontSize: 16 }}>
            终止条件
            <span style={{ color: '#f7917a', marginLeft: 8 }}>
              为保证安全压测，所有业务活动需配置含「RT」和「成功率」的终止条件
            </span>
          </span>}
      >
        <Field
          name="monitoringGoal"
          type="array"
          x-component="ArrayTable"
          minItems={2}
          x-component-props={{ size: 'snall' }}
        >
          <Field type="object">
            <Field
              title="名称"
              name="name"
              type="string"
              x-component="Input"
              x-component-props={{ placeholder: '请输入规则名称' }}
              x-rules={[
                {
                  required: true,
                  whitespace: true,
                  message: '请输入规则名称',
                },
              ]}
            />
            <Field
              title="对象"
              name="id"
              type="string"
              x-component="Select"
              x-component-props={{ placeholder: '请选择' }}
              x-rules={[{ required: true, message: '请输入规则名称' }]}
              enum={[{ label: '全部', value: 0 }]}
            />
            <Field title="规则" type="object">
              <FormTextBox text={`%s %s %s ${'ms'} 出现 %s次`} gutter={8}>
                <Field
                  name="formulaTarget"
                  type="number"
                  x-component="Select"
                  x-component-props={{ placeholder: '指标' }}
                  x-rules={[{ required: true, message: '请选择' }]}
                  enum={[{ label: '全部', value: 0 }]}
                />
                <Field
                  name="formulaSymbol"
                  type="number"
                  x-component="Select"
                  x-component-props={{ placeholder: '条件' }}
                  x-rules={[{ required: true, message: '请选择条件' }]}
                  enum={[{ label: '全部', value: 0 }]}
                />
                <Field
                  name="formulaNumber"
                  type="number"
                  x-component="NumberPicker"
                  x-component-props={{ placeholder: '数值' }}
                  x-rules={[{ required: true, message: '请输入数值' }]}
                />
                <Field
                  name="numberOfIgnore"
                  type="number"
                  x-component="NumberPicker"
                  x-component-props={{ placeholder: '数值' }}
                  x-rules={[{ required: true, message: '请输入数值' }]}
                />
              </FormTextBox>
            </Field>
          </Field>
        </Field>
      </FormBlock>
    </FormLayout>
  );
};
