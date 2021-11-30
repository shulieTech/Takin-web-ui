import React, { useState } from 'react';
import { SchemaField as Field, Schema, FormPath } from '@formily/antd';
import { FormBlock, FormLayout } from '@formily/antd-components';
import styles from '../index.less';
import { Icon, Table, Button, Empty } from 'antd';

const ConditionTableField = (props) => {
  const { value, schema, className, editable, path, mutators, title } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const {
    tableTitle,
    flatTreeData = [],
    dictionaryMap: { SLA_TARGER_TYPE, COMPARE_TYPE },
    minItems,
    maxItems,
  } = componentProps;

  const sampleList = flatTreeData.filter((x) => x.type === 'SAMPLER');

  const columns = [
    {
      title: '名称',
      width: 100,
      render: (text, record, index) => {
        return (
          <Field
            path={FormPath.parse(path).concat(`${index}.name`)}
            schema={
              new Schema({
                type: 'string',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入规则名称',
                  maxLength: 30,
                },
                'x-rules': [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入规则名称',
                  },
                ],
              })
            }
          />
        );
      },
    },

    {
      title: '对象',
      width: 100,
      render: (text, record, index) => {
        return (
          <Field
            path={FormPath.parse(path).concat(`${index}.target`)}
            schema={
              new Schema({
                type: 'array',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                  mode: 'multiple',
                },
                'x-rules': [{ required: true, message: '请选择对象' }],
                enum: [
                  {
                    testName: '全部',
                    xpathMd5: '0f1a197a2040e645dcdb4dfff8a3f960',
                  },
                ]
                  .concat(sampleList)
                  .map((x: any) => ({
                    label: x.testName,
                    value: x.xpathMd5,
                  })),
              })
            }
          />
        );
      },
    },
    {
      title: '规则',
      width: 300,
      render: (text, record, index) => {
        return (
          <div className={styles['rule-td-1']}>
            <Field
              path={FormPath.parse(path).concat(`${index}.formulaTarget`)}
              schema={
                new Schema({
                  type: 'number',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '指标',
                    style: {
                      paddingRight: 8,
                    },
                  },
                  'x-rules': [{ required: true, message: '请选择指标' }],
                  enum: (SLA_TARGER_TYPE || []).map((x) => ({
                    ...x,
                    value: Number(x.value),
                  })),
                })
              }
            />
            <Field
              path={FormPath.parse(path).concat(`${index}.formulaSymbol`)}
              schema={
                new Schema({
                  type: 'number',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '条件',
                    style: {
                      paddingRight: 8,
                    },
                  },
                  'x-rules': [{ required: true, message: '请选择条件' }],
                  enum: (COMPARE_TYPE || []).map((x) => ({
                    ...x,
                    value: Number(x.value),
                  })),
                })
              }
            />
            <Field
              path={FormPath.parse(path).concat(`${index}.formulaNumber`)}
              schema={
                new Schema({
                  type: 'number',
                  'x-component': 'NumberPicker',
                  'x-component-props': {
                    placeholder: '数值',
                    compact: false,
                    addonAfter: '',
                    min: 0,
                    style: {
                      paddingRight: 8,
                      width: '100%',
                    },
                  },
                  'x-rules': [{ required: true, message: '请输入数值' }],
                })
              }
            />
            <span style={{ lineHeight: '40px', padding: '0 8px' }}>
              连续出现
            </span>
            <Field
              path={FormPath.parse(path).concat(`${index}.numberOfIgnore`)}
              schema={
                new Schema({
                  type: 'number',
                  'x-component': 'NumberPicker',
                  'x-component-props': {
                    placeholder: '数值',
                    min: 1,
                    style: {
                      width: '100%',
                    },
                  },
                  'x-rules': [
                    { required: true, message: '请输入数值' },
                    { format: 'integer', message: '请输入整数' },
                  ],
                })
              }
            />
            <span style={{ lineHeight: '40px', padding: '0 8px' }}>次</span>
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 50,
      render: (text, record, index) => {
        const arr = [];
        if (!(maxItems > 0 && value?.length >= minItems)) {
          arr.push(
            <a>
              <Icon
                type="plus-circle"
                style={{ fontSize: 18, marginRight: 8 }}
                onClick={() => mutators.push({})}
              />
            </a>
          );
        }
        if (!(minItems > 0 && value?.length <= minItems)) {
          arr.push(
            <a>
              <Icon
                type="minus-circle"
                style={{ fontSize: 18, marginRight: 8 }}
                onClick={() => mutators.remove(index)}
              />
            </a>
          );
        }
        return (
          <span style={{ display: 'inline-block', marginBottom: 24 }}>
            {arr}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <span style={{ fontWeight: 500 }}>{tableTitle}</span>
      <Table
        size="small"
        pagination={false}
        dataSource={value}
        columns={columns}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Button onClick={() => mutators.push({})}>新增</Button>}
            />
          ),
        }}
      />
    </div>
  );
};

ConditionTableField.isFieldComponent = true;

export default ConditionTableField;
