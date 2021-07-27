import {
  Badge,
  Button,
  Collapse,
  Divider,
  Icon,
  Popover,
  Row,
  Tooltip
} from 'antd';
import Table, { ColumnProps } from 'antd/lib/table';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import EmptyNode from 'src/common/empty-node';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { Link } from 'umi';
import LinkDebugService from '../service';
import CallStackDetailModal from '../Modals/CallStackDetailModal';
import { DetailState } from '../detailPage';
import styles from './../index.less';
import ColorCircle from 'src/common/color-circle/ColorCircle';
interface Props {
  state?: DetailState;
  traceId: string;
  id?: string;
  callStackMessage?: any;
}

const getInitState = () => ({
  callStackData: null,
  loading: false,
  errorNodeData: null,
  visible1: false,
  visible2: false,
  visible3: false,
  expandAllRows: false,
  locateId: null,
  expandedRows: null
});
export type CallStackTableState = ReturnType<typeof getInitState>;
const CallStackTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<CallStackTableState>(
    getInitState()
  );
  const { traceId, id } = props;

  useEffect(() => {
    if (traceId && props.state.tabKey === '1') {
      queryCallStackList({ traceId });
    }
  }, []);

  /**
   * @name 获取调用栈数据
   */
  const queryCallStackList = async value => {
    setState({
      loading: true,
      callStackData: null
    });
    const {
      data: { data, success }
    } = await LinkDebugService.queryCallStackList({
      ...value
    });
    if (success) {
      setState({
        callStackData: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取异常列表
   */
  const getErrorNode = async type => {
    setState({
      visible1: type === 3 ? true : false,
      visible2: type === 2 ? true : false,
      visible3: type === -1 ? true : false
    });
    const {
      data: { data, success }
    } = await LinkDebugService.queryErrorNodeList({
      traceId,
      type,
      resultId: id
    });
    if (success) {
      setState({
        errorNodeData: data
      });
    }
  };

  /**
   * @name 定位获取调用栈
   */
  const getPositionList = async nodeId => {
    setState({
      visible1: false,
      visible2: false,
      visible3: false,
      expandAllRows: true,
      callStackData: null
    });
    const {
      data: { data, success }
    } = await LinkDebugService.queryLocationList({
      nodeId
    });
    if (success) {
      setState({
        callStackData: data && data.vos,
        locateId: data && data.locateId,
        expandedRows: data && data.expandedRow
      });
      getRowHeightAndSetTop(data && data.vos, data && data.locateId);
    }
  };

  /**
   * @name 替换子节点
   */
  function changeNodes(data, key, node) {
    data.map(item => {
      if (item.id === key) {
        item.nextNodes = node;
      }
      if (item.nextNodes) {
        changeNodes(item.nextNodes, key, node);
      }
    });
    return data;
  }

  const handleVisibleChange1 = visible => {
    setState({ visible1: visible });
  };

  const handleVisibleChange2 = visible => {
    setState({ visible2: visible });
  };

  const handleVisibleChange3 = visible => {
    setState({ visible3: visible });
  };

  const handleExpand = async (expanded, record) => {
    if (expanded === false) {
      setState({
        callStackData: changeNodes(state.callStackData, record.id, [])
      });
      return;
    }
    const {
      data: { success, data }
    } = await LinkDebugService.queryCallStackList({
      traceId,
      id: record.id
    });
    if (success) {
      if (data) {
        setState({
          callStackData: changeNodes(state.callStackData, record.id, data)
        });
      }
    }
  };

  const setClassName = (record, index) => {
    if (record.id === state.locateId) {
      return `row${index} ${styles.highlight}`;
    }
  };

  // 设置滚动条位置的方法
  const setTableScrollTop = index => {
    const currPosition = index * 35;
    document.getElementById('baseWrap').scrollTo({
      top: currPosition,
      behavior: 'smooth'
    });
  };

  // 调用getRowHeightAndSetTop方法获取高亮行的index值后，通过setScrollTopValue设置滚动条位置
  // data：table的datasource数据
  // value：当前需要高亮的值
  const getRowHeightAndSetTop = (dataSource, value) => {
    setTableScrollTop(value + 14);
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '方法',
        dataIndex: 'interfaceName',
        ellipsis: true,
        render: (text, row) => {
          return (
            <span
              style={{
                paddingLeft:
                  row.clusterTest === false && row.isUpperUnknownNode
                    ? 40
                    : row.clusterTest === false ||
                      row.isUpperUnknownNode === true
                    ? 20
                    : 0,
                position: 'relative'
              }}
            >
              {row.clusterTest === false && (
                <Tooltip title="流量标记异常，请尽快联系技术支持人员查明原因">
                  <span
                    style={{
                      position: 'absolute',
                      left: 0
                    }}
                  >
                    <img
                      style={{ width: 16 }}
                      src={require('./../../../../assets/yeIcon.png')}
                    />
                  </span>
                </Tooltip>
              )}

              {row.isUpperUnknownNode && (
                <Tooltip title="下游应用未接入探针，或者下游应用有未支持的中间件">
                  <span
                    style={{
                      position: 'absolute',
                      left: row.clusterTest === false ? 20 : 0
                    }}
                  >
                    <img
                      style={{ width: 16 }}
                      src={require('./../../../../assets/question_icon.png')}
                    />
                  </span>
                </Tooltip>
              )}
              <Tooltip placement="bottomLeft" title={text}>
                {text}
              </Tooltip>
            </span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '应用/中间件',
        dataIndex: 'appAndMiddleware',
        ellipsis: true,
        render: (text, row) => {
          return (
            <Tooltip placement="bottomLeft" title={text.join(' / ')}>
              <p
                style={{
                  wordBreak: 'break-all'
                }}
              >
                {text.join(' / ')}
              </p>
            </Tooltip>
          );
        }
      },
      {
        ...customColumnProps,
        title: '服务名',
        dataIndex: 'serviceName',
        ellipsis: true,
        render: (text, row) => {
          return (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'scroll' }}>{text}</div>}
            >
              {text}
            </Tooltip>
          );
        }
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'success',
        width: 70,
        render: (text, row) => {
          return (
            <Fragment>
              <Row type="flex" align="middle">
                <ColorCircle
                  tooltipString={text === true ? '调用正常' : '调用异常'}
                  color={text === true ? '#11DFB2' : '#ED5F47'}
                />

                {row.nodeSuccess === false && (
                  <Fragment>
                    <Divider type="vertical" />
                    <Tooltip title="子节点有异常" trigger="click">
                      <img
                        style={{ width: 14, cursor: 'pointer' }}
                        src={require('./../../../../assets/plaint_icon.png')}
                      />
                    </Tooltip>
                  </Fragment>
                )}
              </Row>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        width: 70,
        render: (text, row) => {
          return (
            <CallStackDetailModal
              btnText="详情"
              rpcId={row.rpcId}
              traceId={row.traceId}
              resultId={id}
              status={row.success}
              agentId={row.agentId}
              appName={row.appName}
              logType={row.logType}
            />
          );
        }
      }
    ];
  };

  const getErrorColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        width: 70,
        dataIndex: 'id'
      },
      {
        ...customColumnProps,
        title: '服务名',
        dataIndex: 'serviceName',
        ellipsis: true
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        width: 80,
        render: (text, row) => {
          return (
            <Fragment>
              <Button
                onClick={() => getPositionList(row.id)}
                type="link"
                style={{ marginRight: 8 }}
              >
                定位
              </Button>
              <span
                onClick={() =>
                  setState({
                    visible1: false,
                    visible2: false,
                    visible3: false
                  })
                }
              >
                <CallStackDetailModal
                  btnText="详情"
                  rpcId={row.rpcId}
                  traceId={row.traceId}
                  resultId={id}
                  status={row.success}
                  agentId={row.agentId}
                  appName={row.appName}
                  logType={row.logType}
                />
              </span>
            </Fragment>
          );
        }
      }
    ];
  };

  const getLostColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'app_name',
        dataIndex: 'appName',
        ellipsis: true
      },
      {
        ...customColumnProps,
        title: 'rpc_id',
        dataIndex: 'rpcId'
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'success',
        render: (text, row) => {
          return (
            <Fragment>
              <Row type="flex" align="middle">
                <ColorCircle
                  tooltipString={text === true ? '调用正常' : '调用异常'}
                  color={text === true ? '#11DFB2' : '#ED5F47'}
                />
              </Row>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <span
              onClick={() => {
                setState({
                  visible1: false,
                  visible2: false,
                  visible3: false
                });
              }}
            >
              <CallStackDetailModal
                btnText="详情"
                rpcId={row.rpcId}
                traceId={row.traceId}
                resultId={id}
                status={row.success}
                agentId={row.agentId}
                appName={row.appName}
                logType={row.logType}
                type={row.type}
              />
            </span>
          );
        }
      }
    ];
  };

  const renderTitle = (title, titleDesc) => {
    return (
      <div>
        {title}
        <Tooltip title={titleDesc}>
          <Icon style={{ marginLeft: 8 }} type="question-circle" />
        </Tooltip>
      </div>
    );
  };

  const filterInfo = (data, value) => {
    return (
      data &&
      data.filter(item => {
        return item.type === value;
      })
    );
  };

  return (
    <div>
      <div className={styles.topTitle}>
        {filterInfo(props.callStackMessage, 3) &&
          filterInfo(props.callStackMessage, 3)[0].count > 0 && (
            <span className={styles.pops}>
              异常节点
              <Popover
                trigger="click"
                title={renderTitle('异常节点', '调用异常')}
                placement="bottomLeft"
                visible={state.visible1}
                onVisibleChange={handleVisibleChange1}
                content={
                  <div style={{ width: 530 }}>
                    <CustomTable
                      dataSource={
                        (state.errorNodeData &&
                          state.errorNodeData[0] &&
                          state.errorNodeData[0].nodes) ||
                        []
                      }
                      columns={getErrorColumns()}
                    />
                  </div>}
              >
                <a onClick={() => getErrorNode(3)}>
                  {filterInfo(props.callStackMessage, 3) &&
                    filterInfo(props.callStackMessage, 3)[0].count}
                </a>
              </Popover>
            </span>
          )}

        {filterInfo(props.callStackMessage, 2) &&
          filterInfo(props.callStackMessage, 2)[0].count > 0 &&
          filterInfo(props.callStackMessage, 3) &&
          filterInfo(props.callStackMessage, 3)[0].count > 0 && (
            <Divider type="vertical" />
          )}
        {filterInfo(props.callStackMessage, 2) &&
          filterInfo(props.callStackMessage, 2)[0].count > 0 && (
            <span>
              未知节点
              <Popover
                trigger="click"
                title={renderTitle(
                  '未知节点',
                  '下游应用未接入探针，或者下游应用有未支持的中间件'
                )}
                visible={state.visible2}
                placement="bottomLeft"
                onVisibleChange={handleVisibleChange2}
                content={
                  <div style={{ width: 530 }}>
                    <CustomTable
                      dataSource={
                        (state.errorNodeData &&
                          state.errorNodeData[0] &&
                          state.errorNodeData[0].nodes) ||
                        []
                      }
                      columns={getErrorColumns()}
                    />
                  </div>}
              >
                <a onClick={() => getErrorNode(2)}>
                  {filterInfo(props.callStackMessage, 2) &&
                    filterInfo(props.callStackMessage, 2)[0].count}
                </a>
              </Popover>
            </span>
          )}

        {filterInfo(props.callStackMessage, -1) &&
          filterInfo(props.callStackMessage, -1)[0].count > 0 && (
            <span style={{ float: 'right' }}>
              <Popover
                trigger="click"
                visible={state.visible3}
                onVisibleChange={handleVisibleChange3}
                placement="bottomLeft"
                content={
                  <div style={{ width: 530, overflow: 'scroll' }}>
                    {state.errorNodeData && state.errorNodeData.length > 0 && (
                      <Collapse
                        defaultActiveKey={
                          state.errorNodeData &&
                          state.errorNodeData.length > 0 &&
                          state.errorNodeData[0].count > 0
                            ? ['0']
                            : ['1']
                        }
                        // onChange={callback}
                        expandIconPosition="right"
                      >
                        {state.errorNodeData.map((item, key) => {
                          if (item.count > 0) {
                            return (
                              <Collapse.Panel
                                style={{ maxHeight: 400, overflow: 'scroll' }}
                                header={
                                  <div>
                                    {item.exception}({item.count})
                                    {item.exception === '丢失节点' && (
                                      <Tooltip title="未识别RPCID">
                                        <Icon
                                          style={{ marginLeft: 8 }}
                                          type="question-circle"
                                        />
                                      </Tooltip>
                                    )}
                                  </div>
                                }
                                key={key}
                              >
                                <div
                                  style={{ maxHeight: 300, overflow: 'scroll' }}
                                >
                                  <CustomTable
                                    dataSource={item.nodes || []}
                                    columns={
                                      item.exception === '丢失节点'
                                        ? getLostColumns()
                                        : getErrorColumns()
                                    }
                                  />
                                </div>
                              </Collapse.Panel>
                            );
                          }
                        })}
                      </Collapse>
                    )}
                  </div>}
              >
                <Button onClick={() => getErrorNode(-1)}>其他异常</Button>
              </Popover>
            </span>
          )}
      </div>
      {state.callStackData &&
        state.callStackData.length > 0 &&
        (state.expandAllRows && state.expandedRows ? (
          <div id="here">
            <CustomTable
              rowClassName={setClassName}
              loading={state.loading}
              rowKey="id"
              columns={getColumns()}
              size="small"
              dataSource={state.callStackData || []}
              // defaultExpandAllRows={true}
              defaultExpandedRowKeys={state.expandedRows}
              childrenColumnName="nextNodes"
              onExpand={(expanded, record) => {
                if (record.id !== 0) {
                  handleExpand(expanded, record);
                }
              }}
            />
          </div>
        ) : (
          <CustomTable
            loading={state.loading}
            rowKey="id"
            columns={getColumns()}
            size="small"
            dataSource={state.callStackData || []}
            defaultExpandAllRows={false}
            defaultExpandedRowKeys={[0]}
            childrenColumnName="nextNodes"
            onExpand={(expanded, record) => {
              if (record.id !== 0) {
                handleExpand(expanded, record);
              }
            }}
          />
        ))}
    </div>
  );
};
export default CallStackTable;
