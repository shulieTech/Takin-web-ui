import React, { useState, useEffect } from 'react';
import { message, Button, Input, Popconfirm } from 'antd';
import SearchTable from 'src/components/search-table';
import service from './service';
import EditModal from './modals/Edit';

const EnvVarsManage = (props) => {
  const [tableReload, setTableReload] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const deleteItem = async (record) => {
    const {
      data: { success },
    } = await service.envVarDelete({
      id: record.id,
    });
    if (success) {
      message.success('操作成功');
      setTableReload(!tableReload);
    }
  };

  const formData = [
    {
      key: 'placeholderKey',
      node: <Input placeholder="搜索名称" />,
    },
  ];

  const columns = [
    { title: '名称', dataIndex: 'placeholderKey' },
    { title: '值', dataIndex: 'placeholderValue' },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => setEditItem({})}
              style={{ marginRight: 8 }}
            >
              编辑
            </Button>
            <Popconfirm title="确定删除？" onConfirm={() => deleteItem(record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <>
      <SearchTable
        commonTableProps={{
          columns,
          size: 'small',
        }}
        tableAction={
          <Button type="primary" onClick={() => setEditItem({})}>
            新增变量
          </Button>}
        commonFormProps={{ formData, rowNum: 6 }}
        ajaxProps={{ url: '/placeholderManage/list', method: 'GET' }}
        toggleRoload={tableReload}
      />
      <EditModal
        editItem={editItem}
        cancelCallback={() => setEditItem(null)}
        okCallback={() => {
          setEditItem(null);
          setTableReload(!tableReload);
        }}
      />
    </>
  );
};

export default EnvVarsManage;
