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

  const { treeData = [], loading = false, flatTreeData = [] } = componentProps;

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

    // 不加rowField这个数据 form.getFieldValue(`goal.${record.xpathMd5}`)取不到值
    const rowField = (
      <SchemaField
        path={FormPath.parse(path).concat(`${record.xpathMd5}`)}
        schema={
          new Schema({
            type: 'object',
          })
        }
      />
    );
    if (record.type === 'SAMPLER') {
      return (
        <>
          {rowField}
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
                  xpathMd5: record.xpathMd5,
                  onBlur: (e) => {
                    // 联动填充空白值
                    form.getFieldState(tdPath, (sourceState) => {
                      form.setFieldState(`.goal.*.${fieldName}`, (state) => {
                        if (
                          sourceState.value &&
                          sourceState.valid &&
                          state.value === undefined &&
                          state.props?.['x-component-props']?.threadType ===
                            'SAMPLER' &&
                          flatTreeData.some(
                            (x) =>
                              x.xpathMd5 ===
                              state.props?.['x-component-props']?.xpathMd5
                          )
                        ) {
                          state.value = sourceState.value;
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
        </>
      );
    }
    if (record.type === 'CONTROLLER') {
      // 逻辑控制器
      return (
        <>
          {rowField}
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
                  xpathMd5: record.xpathMd5,
                  onBlur: (e) => {
                    // 联动填充空白值
                    form.getFieldState(tdPath, (sourceState) => {
                      form.setFieldState(`.goal.*.${fieldName}`, (state) => {
                        if (
                          sourceState.value &&
                          sourceState.valid &&
                          state.value === undefined &&
                          state.props?.['x-component-props']?.threadType ===
                            'CONTROLLER' &&
                          flatTreeData.some(
                            (x) =>
                              x.xpathMd5 ===
                              state.props?.['x-component-props']?.xpathMd5
                          )
                        ) {
                          state.value = sourceState.value;
                        }
                        // 触发其他输入框的验证，为了清除全部不填时的错误信息
                        form.validate(
                          `.goal.${record.xpathMd5}.*(!${fieldName})`
                        );
                      });

                      // 填写逻辑控制器行数据然后清空输入时，会残留一个类似{tps: null}的数据，下面的代码会尝试清除这种数据
                      const hasValue =
                        Object.values(
                          form.getFieldValue(`goal.${record.xpathMd5}`) || {}
                        ).filter(Boolean).length > 0;
                      if (!hasValue) {
                        form.setFieldState(
                          `goal.${record.xpathMd5}`,
                          (state) => {
                            state.value = undefined;
                          }
                        );
                      }
                    });
                  },
                  ...fieldProps,
                },
                'x-rules': [
                  // { required: false, message: `请输入${fieldLabel}` },
                  {
                    // 整行有1个单元格填写，则整行都必填
                    validator: (val) => {
                      const hasValue =
                        Object.values(
                          form.getFieldValue(`goal.${record.xpathMd5}`) || {}
                        ).filter(Boolean).length > 0;
                      return hasValue && !val ? `请输入${fieldLabel}` : null;
                    },
                  },
                  ...moreRules,
                ],
              })
            }
          />
        </>
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
