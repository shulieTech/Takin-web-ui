import React from 'react';
import { Table, message } from 'antd';
import { SchemaField, FormPath, Schema } from '@formily/antd';

const TargetMap = (props) => {
  const {
    value = {},
    schema,
    className,
    editable,
    path,
    mutators,
    form,
  } = props;
  const componentProps = schema.getExtendsComponentProps() || {};

  const { treeData = [], loading = false } = componentProps;

  const renderInputTd = ({
    record,
    fieldName,
    fieldLabel,
    fieldProps = {},
    moreRules = [],
  }) => {
    const tdPath = FormPath.parse(path).concat(
      `${record.xpathMd5}.${fieldName}`
    );
    if (record.type === 'SAMPLER') {
      return (
        <SchemaField
          path={tdPath}
          schema={
            new Schema({
              type: 'number',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: `请输入`,
                min: 0,
                style: {
                  width: 'auto',
                },
                threadType: 'SAMPLER',
                onBlur: (e) => {
                  // 联动填充空白值
                  form.getFieldState(tdPath, (sourceState) => {
                    form.setFieldState(`.goal.*.${fieldName}`, (state) => {
                      if (
                        e.target.value &&
                        sourceState.valid &&
                        state.value === undefined &&
                        state.props?.['x-component-props']?.threadType ===
                          'SAMPLER'
                      ) {
                        state.value = e.target.value;
                      }
                    });
                  });
                },
                ...fieldProps,
              },
              'x-rules': [
                { required: true, message: `请输入${fieldLabel}` },
                ...moreRules,
              ],
            })
          }
        />
      );
    }
    if (record.type === 'CONTROLLER') {
      // 逻辑控制器
      return (
        <SchemaField
          path={tdPath}
          schema={
            new Schema({
              type: 'number',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: `请输入`,
                min: 0,
                style: {
                  width: 'auto',
                },
                threadType: 'CONTROLLER',
                onBlur: (e) => {
                  // 联动填充空白值
                  form.getFieldState(tdPath, (sourceState) => {
                    form.setFieldState(`.goal.*.${fieldName}`, (state) => {
                      if (
                        e.target.value &&
                        sourceState.valid &&
                        state.value === undefined &&
                        state.props?.['x-component-props']?.threadType ===
                          'CONTROLLER'
                      ) {
                        state.value = e.target.value;
                      }
                    });
                  });
                },
                ...fieldProps,
              },
              'x-rules': [
                // { required: false, message: `请输入${fieldLabel}` },
                ...moreRules,
              ],
            })
          }
        />
      );
    }
  };

  const columns = [
    {
      title: '线程',
      dataIndex: 'testName',
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return (
          <span>
            {
              {
                TEST_PLAN: '',
                THREAD_GROUP: '线程组',
                CONTROLLER: '逻辑控制器',
                SAMPLER: 'API',
              }[text]
            }
          </span>
        );
      },
    },
    {
      title: '目标TPS',
      dataIndex: 'tps',
      render: (text, record, index) => (
        <span>
          {renderInputTd({
            record,
            fieldName: 'tps',
            fieldLabel: '目标TPS',
            moreRules: [{ format: 'integer', message: '请输入整数' }],
          })}
        </span>
      ),
    },
    {
      title: '目标RT(ms)',
      dataIndex: 'rt',
      render: (text, record, index) => (
        <span>
          {renderInputTd({
            record,
            fieldName: 'rt',
            fieldLabel: '目标RT',
            moreRules: [{ format: 'integer', message: '请输入整数' }],
          })}
        </span>
      ),
    },
    {
      title: '目标成功率(%)',
      dataIndex: 'sr',
      render: (text, record, index) =>
        renderInputTd({
          record,
          fieldName: 'sr',
          fieldLabel: '目标成功率',
          fieldProps: { max: 100 },
        }),
    },
    {
      title: '目标SA(%)',
      dataIndex: 'sa',
      render: (text, record, index) =>
        renderInputTd({
          record,
          fieldName: 'sa',
          fieldLabel: '目标SA',
          fieldProps: { max: 100 },
        }),
    },
  ];

  return (
    <Table
      key={JSON.stringify(treeData)}
      loading={loading}
      columns={columns}
      pagination={false}
      dataSource={treeData}
      rowKey="xpathMd5"
      defaultExpandAllRows
      size="small"
      {...componentProps}
    />
  );
};

TargetMap.isFieldComponent = true;

export default TargetMap;
