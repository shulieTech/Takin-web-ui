import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Divider,
  Button,
  Icon,
  Switch,
  Input,
  Select,
  message,
  Popconfirm,
  Tooltip,
} from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import EditRowTable, { EditableColumnProps } from 'src/components/edit-row-table';
import { PrepareContext } from '../_layout';

const { Option } = Select;

interface Props {
  detail: any;
  cancelCallback: () => void;
  freshIsoloateHelpInfo: () => void;
}

export default (props: Props) => {
  const { detail, cancelCallback, freshIsoloateHelpInfo } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const inputSearchRef = useRef();
  const [listItemAdded, setListItemAdded] = useState();
  const [boxStyle, setBoxStyle] = useState({ top: '100%' });
  const [batchActionType, setBatchActionType] = useState(undefined);
  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.listShadowTable,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      dsKey: detail.dsKey,
      queryBusinessTableName: undefined,
      status: '',
    },
    isQueryOnMount: false,
  });

  const saveRowData = (record, rowState, setRowState) => {
    rowState?.form?.validateFields(async (errors, values) => {
      if (errors) {
        setRowState({
          errors,
        });
        return;
      }
      setRowState({
        saving: true,
      });

      const newValue = {
        ...record,
        resourceId: detail.resourceId,
        dsKey: detail.dsKey,
        ...values,
        shadowTable: `PT_${values.businessTable || record.businessTable}`,
        joinFlag: values.joinFlag ? 0 : 1,
      };

      delete newValue._edting;

      // 保存行数据
      const {
        data: { success, data },
      } = await service[newValue.id ? 'updateShadowTable' : 'addShadowTable'](
        newValue
      ).finally(() => {
        setRowState({
          saving: false,
        });
      });

      if (success) {
        message.success('操作成功');
        setRowState({
          editing: false,
        });
        if (!newValue.id) {
          setListItemAdded(undefined);
        }
        getList();
        setPrepareState({
          stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
          refreshListKey: prepareState.refreshListKey + 1,
        });
        freshIsoloateHelpInfo();
      }
    });
  };

  const deleteRow = async (row, index) => {
    // 删除行数据
    const {
      data: { success, data },
    } = await service.deleteShadowTable({
      id: row.id,
    });
    if (success) {
      message.success('操作成功');
      getList();
      setPrepareState({
        stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
      });
      freshIsoloateHelpInfo();
    }
  };

  const batchChangeJoin = async (joinFlag) => {
    const ids = list.map((x) => x.id);
    if (ids.length === 0) {
      return;
    }
    setBatchActionType(joinFlag);
    const {
      data: { success },
    } = await service
      .batchUpdateShadowTable({
        joinFlag,
        ids,
        resourceId: prepareState.currentLink?.id,
      })
      .finally(() => {
        setBatchActionType(undefined);
      });
    if (success) {
      message.success('操作成功');
      getList();
      setPrepareState({
        stepStatusRefreshKey: prepareState.stepStatusRefreshKey + 1,
      });
      freshIsoloateHelpInfo();
    }
  };

  const columns: EditableColumnProps[] = [
    {
      title: '业务表名',
      dataIndex: 'businessTable',
      // formField: (
      //   <Input placeholder="请输入" maxLength={25} style={{ width: 120 }} />
      // ),
      getFormField: (record) =>
        record.type === 0 || !record.id ? (
          <Input placeholder="请输入" maxLength={25} style={{ width: 120 }} />
        ) : undefined,
      formFieldOptions: {
        rules: [
          { required: true, whiteSpace: true, message: '请输入业务表名' },
        ],
      },
      render: (text, record) => {
        return (
          <>
            {record.type === 0 && ( // (0-手工 1-自动)
              <span
                style={{
                  backgroundColor: 'var(--Netural-600, #90959A)',
                  borderTopLeftRadius: 4,
                  borderBottomRightRadius: 8,
                  textAlign: 'center',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  width: 14,
                  height: 14,
                  marginRight: 8,
                  fontSize: 12,
                }}
              >
                <Icon type="edit" style={{ color: '#fff' }} />
              </span>
            )}
            {text}
          </>
        );
      },
    },
    {
      title: '影子表名',
      dataIndex: 'shadowTable',
      // formField: (
      //   <Input placeholder="请输入" maxLength={25} style={{ width: 120 }} />
      // ),
      // formFieldOptions: {
      //   rules: [
      //     { required: true, whiteSpace: true, message: '请输入影子表名' },
      //   ],
      // },
      render: (text) => text || '-',
    },
    {
      title: '配置状态',
      dataIndex: 'status',
      render: (text) => {
        return (
          {
            0: <StatusDot title="未检测" />,
            1: (
              <StatusDot
                color="var(--FunctionNegative-500, #D24D40)"
                title="检测失败"
              />
            ),
            2: (
              <StatusDot
                color="var(--FunctionPositive-300, #2DC396)"
                title="检测成功"
              />
            ),
          }[text] || '-'
        );
      },
    },
    {
      title: '是否加入',
      dataIndex: 'joinFlag',
      formField: <Switch />,
      formFieldOptions: {
        valuePropName: 'checked',
      },
      getFormFieldOptions: (record, dataIndex) => {
        return {
          initialValue: record[dataIndex] === 0,
        };
      },
      render: (text, record) => {
        return { 0: '是', 1: '否' }[text] || '-'; // 是否加入压测范围(0-是 1-否)
      },
    },
    // {
    //   title: '类型',
    //   dataIndex: 'type',
    //   render: (text) => {
    //     // TODO 类型
    //     return { 1: '只读', 2: '写入' }[text] || '-';
    //   },
    // },
    {
      title: '操作',
      align: 'right',
      render: (text, record, index, rowState, setRowState) => {
        return rowState?.editing ? (
          <span>
            <Button
              type="link"
              style={{
                marginLeft: 4,
                color: 'var(--FunctionNegative-500, #D24D40)',
              }}
              onClick={() => {
                if (record._edting) {
                  setListItemAdded(undefined);
                }
                setRowState({
                  editing: false,
                  errors: undefined,
                });
              }}
            >
              取消
            </Button>
            <Button
              type="link"
              style={{
                marginLeft: 8,
                color: 'var(--Brandprimary-500, #0FBBD5)',
              }}
              onClick={() => saveRowData(record, rowState, setRowState)}
              loading={rowState?.saving}
            >
              保存
            </Button>
          </span>
        ) : (
          <span>
            {record.type === 0 && (
              <Popconfirm
                title="确认删除？"
                onConfirm={() => deleteRow(record, index)}
              >
                <a style={{ marginLeft: 8 }}>删除</a>
              </Popconfirm>
            )}
            <a
              style={{ marginLeft: 8 }}
              onClick={() => setRowState({ editing: true })}
            >
              编辑
            </a>
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    if (detail?.dsKey) {
      setBoxStyle({
        top: 0,
      });
      getList();
    } else {
      setBoxStyle({
        top: '100%',
      });
    }
  }, [detail]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#fff',
        overflow: 'auto',
        transition: 'top .3s',
        ...boxStyle,
      }}
    >
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, display: 'flex' }}>
          <span
            style={{
              fontSize: 16,
              color: 'var(--Netural-1000, #141617)',
              fontWeight: 600,
            }}
          >
            表信息
          </span>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          <span>{detail.businessDatabase}</span>
          <Tooltip title={detail.database}>
            <span className="truncate" style={{ marginLeft: 24, flex: 1 }}>
              业务库名：{detail.database || '-'}
            </span>
          </Tooltip>
        </div>
        <div style={{ whiteSpace: 'nowrap', marginLeft: 16 }}>
          {list.length > 0 && (
            <>
              <Button
                type="link"
                onClick={() => batchChangeJoin(0)}
                loading={batchActionType === 0}
                disabled={batchActionType === 1}
              >
                全部加入
              </Button>
              <Button
                type="link"
                style={{ marginLeft: 24 }}
                onClick={() => batchChangeJoin(1)}
                loading={batchActionType === 1}
                disabled={batchActionType === 0}
              >
                全部不加入
              </Button>
            </>
          )}
          <Button
            style={{ marginLeft: 24 }}
            onClick={() => setListItemAdded({ _edting: true })}
          >
            新增影子表
          </Button>
          <Icon
            style={{ marginLeft: 24, padding: 8 }}
            type="caret-down"
            onClick={cancelCallback}
          />
        </div>
      </div>
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input.Search
            ref={inputSearchRef}
            placeholder="搜索表名"
            onSearch={(val) =>
              getList({
                queryBusinessTableName: val,
                current: 0,
              })
            }
            style={{
              width: 260,
            }}
          />
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
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
      <EditRowTable
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={listItemAdded ? [listItemAdded, ...list] : list}
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
      />
    </div>
  );
};
