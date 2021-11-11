import React from 'react';
import { Table, InputNumber } from 'antd';
import { SchemaField, FormPath } from '@formily/antd';
import testData from './testData.json';

const TargetMap = (props) => {
  const { value = {}, schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};

  const renderInputTd = (record, fieldName) => {
    if (['TEST_PLAN', 'THREAD_GROUP'].includes(record.type)) {
      return null;
    }
    const tdPath = `${record.xpathMd5}.${fieldName}`;
    return (
      <InputNumber
        style={{
          width: 'auto',
        }}
        min={0}
        placeholder="请输入"
        defaultValue={FormPath.getIn(value, tdPath)}
        onChange={(val) => {
          mutators.change(FormPath.setIn(value, tdPath, val));
        }}
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
      render: (text, record, index) => renderInputTd(record, 'tps'),
    },
    {
      title: '目标RT(ms)',
      dataIndex: 'rt',
      render: (text, record, index) => renderInputTd(record, 'rt'),
    },
    {
      title: '目标成功率(%)',
      dataIndex: 'rs',
      render: (text, record, index) => renderInputTd(record, 'rs'),
    },
    {
      title: '目标SA(%)',
      dataIndex: 'sa',
      render: (text, record, index) => renderInputTd(record, 'sa'),
    },
  ];

  return (
    <Table
      columns={columns}
      pagination={false}
      dataSource={testData}
      rowKey="xpathMd5"
      defaultExpandAllRows
      size="small"
      {...componentProps}
    />
  );
};

TargetMap.isFieldComponent = true;

export default TargetMap;
