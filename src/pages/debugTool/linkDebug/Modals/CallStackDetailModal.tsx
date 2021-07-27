import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Button, Col, Collapse, message, Pagination, Row, Tooltip } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import LinkDebugService from '../service';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import EmptyNode from 'src/common/empty-node';
import { Link } from 'umi';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CodeMirrorWrapper from 'src/common/code-mirror-rapper/CodeMirrorWrapper';
import Loading from 'src/common/loading';
import { MachinePerformanceColumns, MachinePerformanceUnit } from '../enum';
interface Props {
  btnText?: string | React.ReactNode;
  rpcId?: string;
  traceId?: string;
  resultId?: string;
  status?: boolean;
  appName?: string;
  agentId?: string;
  logType?: number;
  type?: number;
}

interface State {
  isReload?: boolean;
  detailData: any;
  stackError: string;
  debugLog: string;
  machineInfoList: any[];
}
const CallStackDetailModal: React.FC<Props> = props => {
  const { resultId, rpcId, traceId, appName, logType, agentId, type } = props;

  const [state, setState] = useStateReducer<State>({
    isReload: false,
    detailData: null,
    stackError: null,
    debugLog: null,
    machineInfoList: null
  });
  const { detailData } = state;
  const { Panel } = Collapse;

  const handleClick = () => {
    queryCallStackDetail({
      rpcId,
      traceId,
      resultId,
      logType,
      appName,
      agentId,
      type
    });
    queryStackError({ rpcId, traceId, logType });
    queryDebugLog({ rpcId, traceId, logType });
    queryMachineInfo({
      rpcId,
      traceId,
      logType
    });
  };

  /**
   * @name 获取调用栈详情
   */
  const queryCallStackDetail = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryCallStackDetail({ ...value });
    if (success) {
      setState({
        detailData: data
      });
    }
  };

  /**
   * @name 获取堆栈异常
   */

  const queryStackError = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryStackError({ ...value });
    if (success) {
      setState({
        stackError: data
      });
    }
  };

  /**
   * @name 获取调试日志
   */
  const queryDebugLog = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryDebugLog({ ...value });
    if (success) {
      setState({
        debugLog: data
      });
    }
  };

  /**
   * @name 获取机器性能信息
   */
  const queryMachineInfo = async value => {
    const {
      data: { success, data }
    } = await LinkDebugService.queryMachineInfo({ ...value });
    if (success) {
      setState({
        machineInfoList: data
      });
    }
  };

  /**
   * @name 删除调试结果
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await LinkDebugService.deleteDebugResult({ id });
    if (success) {
      message.success('删除调试结果成功！');
      setState({
        isReload: !state.isReload
      });
    }
  };

  const dataSource = [
    {
      name: '应用',
      value: (detailData && detailData.appName) || '-'
    },
    {
      name: '上游应用',
      value: (detailData && detailData.upAppName) || '-'
    },
    {
      name: '中间件',
      value: (detailData && detailData.middlewareName) || '-'
    },
    {
      name: '耗时（ms）',
      value: (detailData && detailData.cost) || '-',
      color: '#11BBD5'
    },
    {
      name: '状态码',
      value: (detailData && detailData.resultCode) || '-'
    }
  ];

  const getMachinePerformanceColumns = (): ColumnProps<any>[] => {
    const basic = [
      {
        ...customColumnProps,
        title: '类型',
        dataIndex: MachinePerformanceColumns.类型
      },
      {
        ...customColumnProps,
        title: 'Before(进)',
        dataIndex: MachinePerformanceColumns.Before进,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        ...customColumnProps,
        title: 'Before(出)',
        dataIndex: MachinePerformanceColumns.Before出,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        ...customColumnProps,
        title: 'After（进）',
        dataIndex: MachinePerformanceColumns.After进,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        ...customColumnProps,
        title: 'After（出）',
        dataIndex: MachinePerformanceColumns.After出,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        ...customColumnProps,
        title: 'Exception（进）',
        dataIndex: MachinePerformanceColumns.Exception进,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      },
      {
        ...customColumnProps,
        title: 'Exception（出）',
        dataIndex: MachinePerformanceColumns.Exception出,
        render: (text, row) => {
          return text || text === 0 ? (
            <span>
              {text} {MachinePerformanceUnit[row.type]}
            </span>
          ) : (
            '-'
          );
        }
      }
    ];

    return basic;
  };

  const idsData = [
    {
      name: 'RpcID',
      value: (detailData && detailData.rpcId) || '-'
    },
    {
      name: 'TraceId',
      value: (detailData && detailData.traceId) || '-'
    }
  ];

  const collapseData = [
    {
      title: '堆栈异常',
      node: (
        <CodeMirrorWrapper
          restProps={
          {
              // keyMap: 'sublime',
              // theme: 'eclipse'
              // styleActiveLine: true
          }
          }
          mode="nginx"
          value={state.stackError}
          onChange={() => true}
        />
      )
    },
    {
      title: '插件调试日志',
      node: (
        <CodeMirrorWrapper
          restProps={
          {
              // keyMap: 'sublime',
              // theme: 'eclipse'
              // styleActiveLine: true
          }
          }
          mode="nginx"
          value={state.debugLog}
          onChange={() => true}
        />
      )
    },
    {
      title: '机器性能',
      node: (
        <CustomTable
          rowKey={(row, index) => index.toString()}
          columns={getMachinePerformanceColumns()}
          size="small"
          dataSource={state.machineInfoList || []}
        />
      )
    }
  ];

  const customPanelStyle = {
    background: '#ffffff',
    borderRadius: 2,
    marginBottom: 8,
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  };

  return (
    <CommonModal
      modalProps={{
        width: 'calc(100% - 40px)',
        footer: null,
        title: '调用栈详情',
        maskClosable: false,
        centered: true
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      {state.detailData ? (
        <div
          style={{ height: document.body.clientHeight - 200 }}
          className={styles.callStackDetailWrap}
        >
          <CustomDetailHeader
            dataSource={dataSource}
            title={
              <Row type="flex" align="middle">
                {detailData.clusterTest !== null && (
                  <span className={styles.iconstyle}>
                    {detailData.clusterTest === true ? '压' : '业'}
                  </span>
                )}

                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: '#262626',
                    marginLeft: 8,
                    wordBreak: 'break-all'
                  }}
                >
                  {(detailData && detailData.serviceName) || '-'}
                </span>
              </Row>
            }
          />
          {detailData &&
            detailData.exception &&
            detailData.exception.length > 0 && (
              <Row className={styles.configErrorTool}>
                配置异常：
                {detailData.exception.map((item, key) => {
                  if (key === detailData.exception.length - 1) {
                    return `${item.code}${item.description}`;
                  }
                  return `${item.code}${item.description}、`;
                })}
              </Row>
            )}
          <Row
            align="middle"
            style={{
              border: '1px solid #F0F0F0',
              borderRadius: 2,
              padding: '9px 16px',
              marginTop: 16
            }}
          >
            {idsData.map((item, key) => {
              return (
                <Col key={key} span={12}>
                  <span className={styles.idsName}>{item.name}:</span>
                  <span className={styles.idsValue}>{item.value}</span>
                </Col>
              );
            })}
          </Row>
          <Row type="flex" align="middle" gutter={16} style={{ marginTop: 16 }}>
            <Col span={8} className={styles.paramsWrap}>
              <Row
                type="flex"
                align="middle"
                style={{
                  border: '1px solid #f0f0f0',
                  padding: '16px 16px 16px 16px',
                  lineHeight: '13px'
                }}
              >
                <span className={styles.paramsName}>输入参数:</span>
                <Tooltip title={(detailData && detailData.request) || '-'}>
                  <span className={styles.paramsValue}>
                    {(detailData && detailData.request) || '-'}
                  </span>
                </Tooltip>
              </Row>
            </Col>
            <Col span={8} className={styles.paramsWrap}>
              <Row
                type="flex"
                align="middle"
                style={{
                  border: '1px solid #f0f0f0',
                  padding: '16px 16px 16px 16px',
                  lineHeight: '13px'
                }}
              >
                <span className={styles.paramsName}>输出参数:</span>
                <Tooltip title={(detailData && detailData.response) || '-'}>
                  <span className={styles.paramsValue}>
                    {(detailData && detailData.response) || '-'}
                  </span>
                </Tooltip>
              </Row>
            </Col>
            <Col span={8} className={styles.paramsWrap}>
              <Row
                type="flex"
                align="middle"
                style={{
                  border: '1px solid #f0f0f0',
                  padding: '16px 16px 16px 16px',
                  lineHeight: '13px'
                }}
              >
                <span className={styles.paramsName}>附加参数:</span>
                <Tooltip title={(detailData && detailData.callbackMsg) || '-'}>
                  <span className={styles.paramsValue}>
                    {(detailData && detailData.callbackMsg) || '-'}
                  </span>
                </Tooltip>
              </Row>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Collapse
              defaultActiveKey={['0']}
              expandIconPosition="right"
              bordered={false}
            >
              {collapseData.map((item, k) => {
                return (
                  <Panel
                    style={customPanelStyle}
                    header={
                      <div style={{ position: 'relative' }}>
                        <div className={styles.title}>{item.title}</div>
                      </div>}
                    key={k}
                  >
                    {item.node}
                  </Panel>
                );
              })}
            </Collapse>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </CommonModal>
  );
};
export default CallStackDetailModal;
