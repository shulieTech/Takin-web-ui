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
    } = await service[record.status === 0 ? 'enableEngine' : 'disableEngine']({
      id: record.id,
    });
    if (success) {
      message.success('操作成功');
      setTableReload(!tableReload);
    }
  };

  const formData = [
    {
      key: 'name',
      node: <Input placeholder="搜索机器名称" />,
    },
  ];

  const columns = [
    { title: '机器名称', dataIndex: 'name' },
    { title: '机器IP', dataIndex: 'nodeIp' },
    { title: 'cpu', dataIndex: 'cpu' },
    { title: 'memory', dataIndex: 'memory' },
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
    // { title: '用户名', dataIndex: 'username' },
    // {
    //   title: '密码',
    //   dataIndex: 'password',
    //   render: (text) => {
    //     return <PwdTd text={text} />;
    //   },
    // },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => setEditItem(record)}
              style={{ marginRight: 8 }}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除？"
              onConfirm={() => deleteItem(record)}
            >
              <Button type="link" style={{ marginRight: 8 }}>删除</Button>
            </Popconfirm>
            <Popconfirm
              title={`确定${
                record.status === 0 ? '启动' : '停用'
              }该机器的压力引擎？`}
              onConfirm={() => toggleEngine(record)}
            >
              <Button type="link" style={{ marginRight: 8 }}>
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
          rowKey: 'name',
        }}
        tableAction={
          <Button type="primary" onClick={() => setEditItem({})}>
            新增测试机器
          </Button>}
        commonFormProps={{ formData, rowNum: 6 }}
        ajaxProps={{ url: '/pressureMachine/list', method: 'GET' }}
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
