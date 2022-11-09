import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import { SchemaField, FormPath, Schema, IFieldMergeState } from '@formily/antd';

const MachineTableSelect = (props: IFieldMergeState) => {
  const { value, schema, className, editable, path, mutators, loading } = props;
  const componentProps = schema.getExtendsComponentProps() || {};

  const columns = [
    { title: '所属区域', dataIndex: 'area' },
    { title: 'IP/Host', dataIndex: 'address' },
    { title: '主机' },
    { title: '占用情况' },
    { title: '状态' },
    { title: '使用情况' },
  ];

  return (
    <Spin spinning={loading}>
      <div {...componentProps}>
        系统自动分配了1台压力机（总共1台可用）
        <Table
          size="small"
          dataSource={[]}
          columns={columns}
          rowSelection={
            editable
              ? {
                type: 'checkbox',
                selectedRowKeys: value,
                onChange: (selectedRowKeys) => {
                  mutators.change(selectedRowKeys);
                },
              }
              : undefined
          }
        />
      </div>
    </Spin>
  );
};

MachineTableSelect.isFieldComponent = true;

export default MachineTableSelect;
