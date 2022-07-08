import React, { useState, useEffect } from 'react';
import { message, Button, Input, Popconfirm, Badge, Icon } from 'antd';
import SearchTable from 'src/components/search-table';
import service from './service';
import EditModal from './modals/Edit';

const PwdTd = (props) => {
  const { text } = props;
  const [show, setShow] = useState(false);
  return (
    <>
      <span>{show ? text : '*****'}</span>
      <Icon
        style={{ marginLeft: 4 }}
        type={show ? 'eye-invisible' : 'eye'}
        onClick={() => setShow(!show)}
      />
    </>
  );
};

const TestMachineManage = (props) => {
  const [tableReload, setTableReload] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const deleteItem = async (record) => {
    const {
      data: { success },
    } = await service.machineDelete({
      id: record.id,
    });
    if (success) {
      message.success('操作成功');
      setTableReload(!tableReload);
    }
  };
  const toggleEngine = async (record) => {
    const {
      data: { success },
    } = await service.toggleEngine({
      id: record.id,
      status: record.status === 0 ? 1 : 0,
    });
    if (success) {
      message.success('操作成功');
      setTableReload(!tableReload);
    }
  };

  const formData = [
    {
      key: 'key',
      node: <Input placeholder="搜索名称" />,
    },
  ];

  const columns = [
    { title: '机器名称', dataIndex: 'name' },
    { title: '机器IP', dataIndex: 'ip' },
    {
      title: '压测引擎状态',
      dataIndex: 'status',
      render: (text, record) => {
        return {
          0: <Badge status="default" text="未部署" />,
          1: <Badge status="success" text="已部署" />,
        }[text];
      },
    },
    { title: '用户名', dataIndex: 'username' },
    {
      title: '密码',
      dataIndex: 'password',
      render: (text) => {
        return <PwdTd text={text} />;
      },
    },
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
            <Popconfirm
              title="确定删除？"
              onConfirm={() => deleteItem(record)}
              style={{ marginRight: 8 }}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
            <Popconfirm
              title={`确定${
                record.status === 0 ? '启动' : '停用'
              }该机器的压力引擎？`}
              onConfirm={() => toggleEngine(record)}
            >
              <Button type="link">
                {record.status === 0 ? '启动' : '停用'}压力引擎
              </Button>
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
            新增测试机器
          </Button>}
        commonFormProps={{ formData, rowNum: 6 }}
        ajaxProps={{ url: '/machine/list', method: 'GET' }}
        toggleRoload={tableReload}
      />
      <EditModal
        editItem={editItem}
        cancelCallback={() => setEditItem(null)}
        okCallback={() => {
          setTableReload(!tableReload);
        }}
      />
    </>
  );
};

export default TestMachineManage;
