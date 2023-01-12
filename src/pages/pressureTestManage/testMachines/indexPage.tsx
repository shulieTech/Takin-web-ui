import React, { useState, useEffect, useCallback } from 'react';
import {
  message,
  Button,
  Input,
  Popconfirm,
  Badge,
  Modal,
  Popover,
  Tooltip,
  Alert,
  Steps,
} from 'antd';
import SearchTable from 'src/components/search-table';
import service from './service';
import EditModal from './modals/Edit';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import DeployToBenchmarkModal from './modals/DeployToBenchmark';
import ImportFileModal from './modals/ImportFileModal';
import TagDepolyModal from './modals/TagDeployModal';

const DeployStatus = (prop) => {
  const { record } = prop;

  return (
    <Popover
      placement="right"
      content={
        <Steps
          direction="vertical"
          size="small"
          current={record.currentProgressIndex || 0}
        >
          {(record.deployProgressList || []).map((x) => {
            return <Steps.Step key={x} title={x} />;
          })}
        </Steps>
      }
    >
      <a>部署中</a>
    </Popover>
  );
};

const TestMachineManage = (props) => {
  const [tableReload, setTableReload] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [benchmarkDeployItem, setBenchmarkDeployItem] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [searchTableRef, setSearchTableRef] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [tagVisible, setTagVisible] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [suiteList, setSuiteList] = useState([]);
  const refHandle = useCallback((ref) => setSearchTableRef(ref), []);

  /**
   * @name 获取全部机器tag列表
   */
  const queryTagList = async () => {
    const {
      data: { success , data },
    } = await service.queryTagList({
    });
    if (success) {
      setTagList(data?.map((item) => {
        return { label: item, value: item };
      }));
    }
  };

  /**
   * @name 获取全部基准测试机列表
   */
  const querySuiteList = async () => {
    const {
      data: { success , data },
    } = await service.suiteList({
      current: 0,
      pageSize: 99999
    });
    if (success) {
      setSuiteList(data?.map((item) => {
        return { label: item?.suite, value: item?.suite };
      }));
    }
  };
  
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
            <Alert
              style={{ marginBottom: 8 }}
              type="info"
              message={
                <span>
                  请提前初始化k8s node节点，再进行一键部署，否则安装失败，详情见
                  <a
                    href="https://shulietech.feishu.cn/wiki/wikcnY8BTN5L8fcuB5CjAUEPZEb"
                    target="_blank"
                  >
                    操作手册
                  </a>
                  ，
                </span>
              }
            />
            确定部署该节点？
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
          setTimeout(() => {
            setTableReload(!tableReload);
          }, 1000);
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
    { title: '标签', dataIndex: 'tag', render: (text) => text || '-'  },
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
            status={
              {
                0: 'default',
                1: 'processing',
                2: 'success',
              }[text]
            }
            text={
              {
                0: '未部署',
                1: <DeployStatus record={record} />,
                2: '已部署',
              }[text]
            }
          />
        );
      },
    },
    {
      title: '可用状态',
      dataIndex: 'engineStatus',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '部署类型',
      dataIndex: 'deployType',
      render: (text, record) => {
        return (
          <span>
            {text || '-'}
            {record.benchmarkSuiteName ? `(${record.benchmarkSuiteName})` : ''}
          </span>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <div
              style={{
                whiteSpace: 'nowrap',
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {text || '-'}
            </div>
          </Tooltip>
        );
      },
    },
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
            {record.status !== 1 && (
              <Popconfirm
                title="确定删除？"
                onConfirm={() => deleteItem(record)}
              >
                <Button type="link" style={{ marginRight: 8 }}>
                  删除
                </Button>
              </Popconfirm>
            )}
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

  useEffect(() => {
    // 有部署中状态，定时刷新列表
    const needRefresh = searchTableRef?.tableState?.dataSource.some(
      (x) => x.status === 1
    );
    if (needRefresh) {
      const { queryList } = searchTableRef;
      const refreshTimer = setInterval(() => {
        queryList();
      }, 10000);
      return () => clearInterval(refreshTimer);
    }
  }, [searchTableRef]);

  return (
    <>
      <SearchTable
        ref={refHandle}
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
            <Button  style={{ marginRight: 8 }} type="primary" ghost onClick={() => {
              setTagVisible(true);
              queryTagList(); 
              querySuiteList();
            }
              }>
              标签部署
            </Button>
            <Button  style={{ marginRight: 8 }} type="primary" ghost onClick={() => setVisible(true)}>
              导入机器列表
            </Button>
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
      <ImportFileModal
        btnText="导入机器列表"
        visible={visible}
        onSuccess={() => {
          setTableReload(!tableReload);
        }}
        setVisible={setVisible}
      />
      <TagDepolyModal
        btnText="标签部署"
        visible={tagVisible}
        onSuccess={() => {
          setTableReload(!tableReload);
        }}
        data={tagList}
        suiteList={suiteList}
        setVisible={setTagVisible}
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
          setTimeout(() => {
            setTableReload(!tableReload);
          }, 1000);
        }}
        cancelCallback={() => {
          setBenchmarkDeployItem(null);
        }}
      />
    </>
  );
};

export default TestMachineManage;
