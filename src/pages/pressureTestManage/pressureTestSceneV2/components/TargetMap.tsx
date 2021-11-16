import React from 'react';
import { Table } from 'antd';
import { SchemaField, FormPath, Schema } from '@formily/antd';

const TargetMap = (props) => {
  const { value = {}, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};

  const { treeData = [], loading = false } = componentProps;

  const renderInputTd = (record, fieldName, fieldLabel, fieldProps = {}) => {
    if (!['SAMPLER'].includes(record.type)) {
      return null;
    }
    const tdPath = FormPath.parse(path).concat(
      `${record.xpathMd5}.${fieldName}`
    );
    return (
      <SchemaField
        path={tdPath}
        schema={
          new Schema({
            type: 'number',
            'x-component': 'NumberPicker',
            'x-component-props': {
              placeholder: '请输入',
              min: 0,
              style: {
                width: 'auto',
              },
              ...fieldProps,
            },
            'x-rules': [{ required: true, message: `请输入${fieldLabel}` }],
          })
        }
      />
    );
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
        <span>{renderInputTd(record, 'tps', '目标TPS')}</span>
      ),
    },
    {
      title: '目标RT(ms)',
      dataIndex: 'rt',
      render: (text, record, index) => renderInputTd(record, 'rt', '目标RT'),
    },
    {
      title: '目标成功率(%)',
      dataIndex: 'sr',
      render: (text, record, index) =>
        renderInputTd(record, 'sr', '目标成功率', { max: 100 }),
    },
    {
      title: '目标SA(%)',
      dataIndex: 'sa',
      render: (text, record, index) =>
        renderInputTd(record, 'sa', '目标SA', { max: 100 }),
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
