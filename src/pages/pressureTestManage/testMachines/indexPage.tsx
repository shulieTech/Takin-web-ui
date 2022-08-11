import React, { useState, useEffect } from 'react';
import { message, Button, Input, Popconfirm, Badge, Icon, Modal } from 'antd';
import SearchTable from 'src/components/search-table';
import service from './service';
import EditModal from './modals/Edit';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import DeployToBenchmarkModal from './modals/DeployToBenchmark';

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
  const [benchmarkDeployItem, setBenchmarkDeployItem] = useState(null);
  const [syncing, setSyncing] = useState(false);

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
    Modal.confirm({
      title: '提示',
      content:
        record.status === 2 ? (
          '确定卸载该节点？'
        ) : (
          <span>
            <b>部署前请初始化k8s相关基础环境，否则会部署失败</b>
            ，确定部署该节点？
          </span>
        ),
      onOk: async () => {
        const {
          data: { success },
        } = await service[record.status === 2 ? 'disableEngine' : 'enableEngine']({
          id: record.id,
        });
        if (success) {
          message.success('操作成功');
          setTableReload(!tableReload);
        }
      },
    });
  };

  const machineSync = async () => {
    setSyncing(true);
    const {
      data: { success },
    } = await service.machineSync().finally(() => {
      setSyncing(false);
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
    { title: '机器名称', dataIndex: 'machineName' },
    { title: '机器IP', dataIndex: 'machineIp' },
    { title: 'cpu', dataIndex: 'cpu', render: (text) => text || '-' },
    { title: 'memory', dataIndex: 'memory', render: (text) => text || '-' },
    { title: '创建时间', dataIndex: 'createTime' },
    {
      title: '部署状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Badge
            status={text === 2 ? 'success' : 'default'}
            text={{ 0: '未部署', 2: '已部署' }[text]}
          />
        );
      },
    },
    {
      title: '压测引擎状态',
      dataIndex: 'engineStatus',
      render: (text, record) => {
        return text || '-';
      },
    },
    // { title: '用户名', dataIndex: 'userName' },
    // {
    //   title: '密码',
    //   dataIndex: 'password',
    //   render: (text) => {
    //     return <PwdTd text={text} />;
    //   },
    // },
    {
      title: '操作',
      width: 'max-content',
      fixed: 'right',
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
            <Popconfirm title="确定删除？" onConfirm={() => deleteItem(record)}>
              <Button type="link" style={{ marginRight: 8 }}>
                删除
              </Button>
            </Popconfirm>
            {record.status === 2 && (
              <Button
                type="link"
                style={{ marginRight: 8 }}
                onClick={() => toggleEngine(record)}
              >
                卸载节点
              </Button>
            )}
            {record.status === 0 && (
              <>
                <Button
                  type="link"
                  style={{ marginRight: 8 }}
                  onClick={() => toggleEngine(record)}
                >
                  takin发压机部署
                </Button>
              </>
            )}
            {record.status === 0 && (
              <Button
                type="link"
                style={{ marginRight: 8 }}
                onClick={() => setBenchmarkDeployItem(record)}
              >
                基准测试测试机部署
              </Button>
            )}
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
          rowKey: 'id',
          scroll: {
            x: 'max-content',
          },
        }}
        tableAction={
          <>
            <Button
              type="primary"
              style={{ marginRight: 8 }}
              ghost
              loading={syncing}
              onClick={() => machineSync()}
            >
              同步
            </Button>
            <Button type="primary" onClick={() => setEditItem({})}>
              新增测试机器
            </Button>
          </>
        }
        commonFormProps={{ formData, rowNum: 6 }}
        ajaxProps={{ url: '/pressureMachine/list', method: 'GET' }}
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
      <DeployToBenchmarkModal
        machine={benchmarkDeployItem}
        okCallback={() => {
          setBenchmarkDeployItem(null);
          setTableReload(!!tableReload);
        }}
        cancelCallback={() => {
          setBenchmarkDeployItem(null);
        }}
      />
    </>
  );
};

export default TestMachineManage;
