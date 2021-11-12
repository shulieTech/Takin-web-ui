import React from 'react';
import { Table } from 'antd';
import { SchemaField, FormPath, Schema } from '@formily/antd';

const TargetMap = (props) => {
  const { value = {}, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};

  const { treeData = [] } = componentProps;

  const renderInputTd = (record, fieldName, fieldLabel, fieldProps = {}) => {
    if (['TEST_PLAN', 'THREAD_GROUP'].includes(record.type)) {
      return null;
    }
    const tdPath = FormPath.parse(path).concat(`${record.xpathMd5}.${fieldName}`);
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
            'x-rules': [
              { required: true, message: `请输入${fieldLabel}` }
            ],
          })
        }
      />
    );
  };

  const columns = [
    {
      title: '线程',
      dataIndex: 'name',
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '目标TPS',
      dataIndex: 'tps',
      render: (text, record, index) => renderInputTd(record, 'tps', '目标TPS'),
    },
    {
      title: '目标RT(ms)',
      dataIndex: 'rt',
      render: (text, record, index) => renderInputTd(record, 'rt', '目标RT'),
    },
    {
      title: '目标成功率(%)',
      dataIndex: 'rs',
      render: (text, record, index) => renderInputTd(record, 'rs', '目标成功率', { max: 100 }),
    },
    {
      title: '目标SA(%)',
      dataIndex: 'sa',
      render: (text, record, index) => renderInputTd(record, 'sa', '目标SA', { max: 100 }),
    },
  ];

  return (
    <Table
      key={JSON.stringify(treeData)}
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
