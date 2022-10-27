import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Divider,
  Icon,
  Button,
  Tooltip,
  Table,
  Input,
  Select,
  Tag,
  Switch,
  Dropdown,
  Popconfirm,
  message,
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import TableInfo from './TableInfo';
import { PrepareContext } from '../_layout';

const { Option } = Select;

const DropdowTable = (props) => {
  const { defaultList = [] } = props;
  const [list, setList] = useState(defaultList);

  const filterList = (e) => {
    if (e.target.value && e.target.value.trim()) {
      setList(
        defaultList.filter((x) => x.appName.indexOf(e.target.value.trim()) > -1)
      );
    } else {
      setList(defaultList);
    }
  };
  return (
    <div
      style={{
        width: 320,
        padding: 8,
        background: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
      }}
    >
      <Input.Search
        placeholder="搜索应用"
        style={{
          marginBottom: 8,
        }}
        onChange={filterList}
      />
      <Table
        size="small"
        rowKey="appName"
        dataSource={list}
        columns={[
          {
            title: '应用',
            dataIndex: 'appName',
          },
          {
            title: '是否加入压测范围',
            dataIndex: 'joinPressure',
            fixed: 'right',
            align: 'right',
            render: (text) => {
              return <Switch checked={text === 0} size="small" disabled />;
            },
          },
        ]}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

interface Props {
  setEditedDataSource: (record: any) => void;
  isolateListRefreshKey: number;
  freshIsoloateHelpInfo: () => void;
}
export default (props: Props) => {
  const { setEditedDataSource, freshIsoloateHelpInfo } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const inputSearchRef = useRef();
  const [editShadowTable, setEditShadowTable] = useState<any>(undefined);
  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.datasourceViewMode,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      queryBusinessDataBase: undefined,
      status: '',
      resourceId: prepareState.currentLink.id,
    },
    isQueryOnMount: false,
  });

  const toggleItem = (record) => {
    // TODO 启用禁用数据源
  };

  const columns = [
    {
      title: '数据源地址',
      dataIndex: 'businessDatabase',
      render: (text, record) => {
        return (
          <>
            {{
              0: <StatusDot title="未检测" />,
              1: (
                <>
                  <StatusDot
                    color="var(--FunctionNegative-500, #D24D40)"
                    title="检测失败"
                  />
                  {record.remark && (
                    <>
                      <Divider
                        type="vertical"
                        style={{ height: 24, margin: '0 24px' }}
                      />
                      <Tooltip title={record.remark}>
                        <Icon
                          type="file-text"
                          theme="filled"
                          style={{
                            cursor: 'pointer',
                            color: 'var(--Brandprimary-500, #0FBBD5)',
                          }}
                        />
                      </Tooltip>
                    </>
                  )}
                </>
              ),
              2: (
                <StatusDot
                  color="var(--FunctionPositive-300, #2DC396)"
                  title="检测成功"
                />
              ),
            }[record.status] || '-'}
            <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
            <div style={{ display: 'inline-flex' }}>
              <div
                style={{
                  width: 40,
                  lineHeight: '38px',
                  height: 40,
                  textAlign: 'center',
                  border: '1px solid var(--Netural-200, #E5E8EC)',
                  borderRadius: 16,
                  marginRight: 24,
                  position: 'relative',
                }}
              >
                <span
                  className="iconfont icon-shujuku"
                  style={{
                    fontSize: 18,
                    color: 'var(--Netural-1000, #141617)',
                  }}
                />
                {record.type === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'var(--Netural-600, #90959A)',
                      borderTopLeftRadius: 4,
                      borderBottomRightRadius: 8,
                      textAlign: 'center',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      width: 14,
                      height: 14,
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    <Icon type="edit" style={{ color: '#fff' }} />
                  </span>
                )}
              </div>
              <div>
              <Tooltip title={text}>
                  <div
                    style={{
                      color: 'var(--Netural-1000, #141617)',
                      maxWidth: 300
                    }}
                    className="truncate"
                  >
                    {text}
                  </div>
                </Tooltip>
                <div
                  style={{
                    color: 'var(--Netural-600, #90959A)',
                  }}
                >
                  ID:{record.id}
                  {/* TODO */}
                  {/* <Tag style={{ marginLeft: 8 }}>只读</Tag> */}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'businessUserName',
      render: (text, record) => {
        return text || '-';
      },
    },
    {
      title: '类型',
      dataIndex: 'middlewareType',
      render: (text, record) => {
        return text ? <Tag>{text}</Tag> : '-';
      },
    },
    {
      title: '操作',
      align: 'right',
      render: (text, record) => {
        return (
          <span onClick={(e) => e.stopPropagation()}>
            {record.appList?.length > 0 ? (
              <Dropdown overlay={<DropdowTable defaultList={record.appList} />}>
                <a style={{ marginLeft: 16 }}>
                  查看{record.appList.length}个应用
                </a>
              </Dropdown>
            ) : (
              '-'
            )}
            <Popconfirm title="确认启用？" onConfirm={() => toggleItem(record)}>
              <a style={{ marginLeft: 16 }}>启用</a>
            </Popconfirm>
            <a
              style={{ marginLeft: 16 }}
              onClick={() => setEditedDataSource(record)}
            >
              编辑
            </a>
            {record.type === 0 && (
              <Popconfirm
                title="确认删除？"
                onConfirm={() => deleteItem(record)}
              >
                <a style={{ marginLeft: 16 }}>删除</a>
              </Popconfirm>
            )}
          </span>
        );
      },
    },
  ];

  const deleteItem = async (record) => {
    const {
      data: { success },
    } = await service.deleteDataSource({ id: record.id });
    if (success) {
      message.success('操作成功');
      getList();
      setPrepareState({
        stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
        refreshListKey: prepareState.refreshListKey + 1,
      });
    }
  };

  useEffect(() => {
    getList();
  }, [props.isolateListRefreshKey]);

  if (editShadowTable) {
    // 编辑影子表
    return (
      <TableInfo
        detail={editShadowTable}
        cancelCallback={() => setEditShadowTable(undefined)}
        freshIsoloateHelpInfo={freshIsoloateHelpInfo}
      />
    );
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 32px',
        }}
      >
        <div style={{ flex: 1 }}>
          <span style={{ marginRight: 24 }}>
            配置状态：
            <Select
              style={{ width: 114 }}
              value={query.status}
              onChange={(val) =>
                getList({
                  status: val,
                  current: 0,
                })
              }
            >
              <Option value="">全部</Option>
              <Option value={0}>未检测</Option>
              <Option value={1}>检测失败</Option>
              <Option value={2}>检测成功</Option>
            </Select>
          </span>
        </div>
        <div>
          <Input.Search
            ref={inputSearchRef}
            placeholder="搜索数据源"
            onSearch={(val) =>
              getList({
                queryBusinessDataBase: val,
                current: 0,
              })
            }
            style={{
              width: 260,
            }}
          />
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <Button
            type="link"
            onClick={() => {
              resetList();
              inputSearchRef?.current?.input?.setValue();
            }}
            disabled={loading}
          >
            重置
          </Button>
          <Button
            style={{ width: 32, padding: 0, marginLeft: 32 }}
            onClick={() => getList()}
            disabled={loading}
          >
            <Icon type="sync" spin={loading} />
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          rowKey={row => row.dsKey || row.id}
          columns={columns}
          dataSource={list}
          pagination={{
            total,
            pageSize: query.pageSize,
            current: query.current + 1,
            hideOnSinglePage: true,
            onChange: (page, pageSize) =>
              getList({
                pageSize,
                current: page - 1,
              }),
            style: { marginRight: 60 },
          }}
          loading={loading}
          size="small"
          onRow={(record) => {
            // 影子表隔离方式时，点击行触发编辑影子表
            return prepareState.currentLink.isolateType === 3
              ? {
                onClick: () => {
                  setEditShadowTable(record);
                },
              }
              : {};
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};
