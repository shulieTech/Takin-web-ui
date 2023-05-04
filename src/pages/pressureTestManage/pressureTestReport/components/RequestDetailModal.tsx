import { message, Row, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import copy from 'copy-to-clipboard';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import ColorCircle from 'src/common/color-circle/ColorCircle';
import Loading from 'src/common/loading';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { router } from 'umi';
import Header from '../components/Header';
import PressureTestReportService from '../service';
import styles from './../index.less';

interface Props {
  btnText: any;
  traceId?: string;
  isLive?: boolean;
  reportId?: string;
  totalRt?: number;
}

interface State {
  isReload?: boolean;
  data?: any;
  totalCost?: number;
  startTime?: string;
  entryHostIp?: string;
  clusterTest?: boolean;
  traceId: string;
  loading?: boolean;
  originData?: any[];
  totalRt?: number;
}
const RequestDetailModal: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    data: null,
    originData: null,
    totalCost: null,
    startTime: null,
    entryHostIp: null,
    clusterTest: null,
    traceId: null,
    loading: false,
    totalRt: null,
  });

  const { traceId } = props;

  const timestampToTime = (timestamp) => {
    const date = new Date(timestamp);
    const Y = `${date.getFullYear()}-`;
    const M =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}-`
        : `${date.getMonth() + 1}-`;
    const D =
      date.getDate() < 10 ? `0${date.getDate()} ` : `${date.getDate()} `;
    const h = `${date.getHours()}:`;
    const m = `${date.getMinutes()}:`;
    const s = date.getSeconds();
    return Y + M + D + h + m + s;
  };

  const handleClick = () => {
    setState({
      traceId,
      totalRt: props.totalRt,
    });
    queryRequestDetail({
      traceId,
    });
  };

  /**
   * @name 获取请求详情列表
   */
  const queryRequestDetail = async (value) => {
    setState({
      data: null,
      loading: true,
    });
    const {
      data: { success, data },
    } = await PressureTestReportService.queryRequestDetail({
      ...value,
    });
    if (success) {
      if (data) {
        setState({
          originData: data.traces,
          data: data.traces,
          totalCost: data.totalCost,
          startTime: data.startTime,
          entryHostIp: data.entryHostIp,
          clusterTest: data.clusterTest,
          loading: false,
        });
      } else {
        setState({
          data: null,
          loading: false,
        });
      }
    }
  };

  const handleCopy = async (value) => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    const columns: ColumnProps<any>[] = [
      {
        ...customColumnProps,
        title: '服务',
        dataIndex: 'serviceName',
        ellipsis: true,
        // width: 300,
        render: text => {
          return (
            <span>
              <Tooltip placement="bottomLeft" title={text}>
                <span>{text}</span>
              </Tooltip>
            </span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '关联应用',
        dataIndex: 'appName',
        // width: 100
      },
      {
        ...customColumnProps,
        title: '方法名称',
        dataIndex: 'methodName',
        ellipsis: true,
        // width: 150
      },
      {
        ...customColumnProps,
        title: '请求体',
        dataIndex: 'request',
        width: 150,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</div>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '响应体',
        dataIndex: 'response',
        width: 150,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'auto' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{text}</div>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '中间件名称',
        dataIndex: 'middlewareName',
        // width: 100
      },
      {
        ...customColumnProps,
        title: '结果',
        dataIndex: 'status',
        // width: 70,
        render: (text) => {
          return (
            <Fragment>
              <Row type="flex" align="middle">
                <ColorCircle color={text === true ? '#11DFB2' : '#ED5F47'} />
              </Row>
            </Fragment>
          );
        }
      },
      {
        ...customColumnProps,
        title: '总耗时ms',
        dataIndex: 'totalCost',
        // width: 100
      },
      {
        ...customColumnProps,
        title: '流量来源',
        dataIndex: 'clusterTest',
        // width: 50,
        render: text => text ? <span>压测</span> : <span>业务</span>
      },   
    ];
    return columns;
  };

  const handleExpand = async (expanded, record) => {
    if (expanded === false) {
      setState({
        data: changeNodes(state.data, record.id, []),
      });
      return;
    }
    const {
      data: { success, data },
    } = await PressureTestReportService.queryRequestDetail({
      traceId,
      id: record.id,
    });
    if (success) {
      if (data) {
        setState({
          data: changeNodes(state.data, record.id, data.traces),
        });
      }
    }
  };

  /**
   * @name 替换子节点
   */
  function changeNodes(data, id, node) {
    data.map((item) => {
      if (item.id === id) {
        item.nextNodes = node;
      }
      if (item.nextNodes) {
        changeNodes(item.nextNodes, id, node);
      }
    });

    return data;
  }

  const requestHeadList = [
    {
      label: '调用链路入口',
      value: state.entryHostIp,
    },
    {
      label: '开始时间',
      value: state.startTime && timestampToTime(state.startTime),
    },
    {
      label: '总耗时',
      value: state.totalRt ? `${state.totalRt}ms` : null,
    },
    {
      label: '网络耗时',
      value: `${Math.max(state.totalRt - state.totalCost, 0)}ms`,
    },
    {
      label: '接口耗时',
      value: state.totalCost ? `${state.totalCost}ms` : null,
    },
  ];

  return (
    <CommonModal
      modalProps={{
        width: 'calc(100% - 40px)',
        footer: null,
        maskClosable: false,
        centered: true,
        title: (
          <p style={{ fontSize: 16 }}>
            请求详情
            <span style={{ color: '#a2a6b1', fontSize: 12, marginLeft: 16 }}>
              (请求日志数据仅保留3天，3天后将无法查看，请知晓。)
            </span>
          </p>
        ),
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <div
        style={{ height: document.body.clientHeight - 200, overflow: 'auto' }}
      >
        <div style={{ marginBottom: 26 }}>
          <div style={{ lineHeight: '32px', marginBottom: 8 }}>
            <span className={styles.requestTitle}>{state.traceId}</span>
            {state.data?.length > 0 && state.clusterTest !== null && (
              <span className={styles.requestTag}>
                {state.clusterTest ? '压测流量' : '业务流量'}
              </span>
            )}
          </div>
          <Header list={requestHeadList} isExtra={false} />
        </div>
        {state.data && state.data[0] && !state.loading ? (
          <div className={styles.detailTable}>
            <CustomTable
              indentSize={8}
              rowKey="id"
              columns={getColumns()}
              size="small"
              dataSource={state.data}
              defaultExpandAllRows={false}
              defaultExpandedRowKeys={[
                state.data && state.data[0] && state.data[0].id,
              ]}
              childrenColumnName="nextNodes"
              onExpand={(expanded, record) => {
                if (record.id !== 0) {
                  handleExpand(expanded, record);
                }
              }}
            />
          </div>
        ) : state.data === null && state.loading ? (
          <Loading />
        ) : (
          <div className={styles.defaultWrap}>
            <div className={styles.circle} />
            <p className={styles.defaultTxt}>
              请求日志数据已清理，请查看其他报告信息。
            </p>
          </div>
        )}
      </div>
    </CommonModal>
  );
};
export default RequestDetailModal;

RequestDetailModal.defaultProps = {
  isLive: false,
};