import React, { useState } from 'react';
import { SchemaMarkupField as Field } from '@formily/antd';
import { FormBlock, FormLayout, FormTextBox } from '@formily/antd-components';

export default (props) => {
  const {
    dictionaryMap: { SLA_TARGER_TYPE, COMPARE_TYPE },
    targetList = [],
    title,
    name,
  } = props;

  const [unit, setUnit] = useState('');

  const getUnit = (val) => {
    switch (val) {
      case '0':
        return 'ms';
      case '1':
        return '';
      default:
        return '%';
    }
  };

  return (
    <FormLayout
      labelCol={0}
      wrapperCol={24}
      labelAlign={undefined}
      prefixCls={undefined}
    >
      <FormBlock title={title}>
        <Field
          name={name}
          type="array"
          x-component="ArrayTable"
          // minItems={2}
          x-component-props={{
            operationsWidth: 100,
            renderMoveUp: () => null,
            renderMoveDown: () => null,
          }}
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
              enum={[
                { label: '全部', value: 0 },
                ...targetList.map((x) => ({
                  label: x.businessActivityName,
                  value: x.businessActivityId,
                })),
              ]}
            />
            <Field title="规则" type="object" x-component="block">
              <FormTextBox
                text={`%s %s %s ${unit} 连续出现 %s次`}
                gutter={8}
                name="textBox"
              >
                <Field
                  name="formulaTarget"
                  type="number"
                  x-component="Select"
                  x-component-props={{
                    placeholder: '指标',
                    // onChange: (val) => {
                    //   setUnit(getUnit(val));
                    // },
                  }}
                  x-rules={[{ required: true, message: '请选择' }]}
                  enum={SLA_TARGER_TYPE || []}
                />
                <Field
                  name="formulaSymbol"
                  type="number"
                  x-component="Select"
                  x-component-props={{ placeholder: '条件' }}
                  x-rules={[{ required: true, message: '请选择条件' }]}
                  enum={COMPARE_TYPE || []}
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
