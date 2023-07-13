import {
  Button,
    Divider,
    message,
    Row,
    Tooltip,
  } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import copy from 'copy-to-clipboard';
import { CommonModal, useStateReducer } from 'racc';
import React, { Fragment, useState } from 'react';
import ColorCircle from 'src/common/color-circle/ColorCircle';
import Loading from 'src/common/loading';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { router } from 'umi';
import moment from 'moment';
import Header from '../components/Header';
import styles from './../index.less';
import TrackService from '../service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
  
interface Props {
  btnText: string | React.ReactNode;
  row?: any;
  isLive?: boolean;
  datas: any;
  reportId?: string;
  startTime: any;
  traceId?: any;
}
  
interface State {
  isReload?: boolean;
  data: any;
  cost: number;
  startTime: string;
  host: string;
  loading: boolean;
  originData: any[];
  traceId: any;
}
const RequestDetailModal: React.FC<Props> = props => {
  const contentRef = React.createRef();
  const [contentWidth, setContentWidth] = useState(null);
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    data: null,
    originData: null,
    cost: null,
    startTime: null,
    host: null,
    loading: false,
    traceId: null
  });
  const { row, datas, traceId } = props;
  const handleClick = () => {
    setState({
      traceId,
    });
    queryRequestDetail({
      traceId,
      startTime: moment(props.startTime).subtract(5, 'm').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(props.startTime).add(5, 'm').format('YYYY-MM-DD HH:mm:ss'),
      appName: datas,
    });
  };
  
    /**
     * @name 获取请求详情列表
     */
  const queryRequestDetail = async value => {
    setState({
      data: null,
      loading: true
    });
    const {
        data: { success, data }
      } = await TrackService.queryTraceFlowManage({
        ...value
      });
    if (success) {
      if (data) {
        setState({
          originData: data.traces,
          data: data.traces,
          cost: data.cost,
          startTime: data.startTime,
          host: data.host,
          loading: false
        });
      } else {
        setState({
          data: null,
          loading: false
        });
      }
    }
  };
  
  const handleCopy = async value => {
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
        data: changeNodes(state.data, record.id, [])
      });
      return;
    }
    const {
        data: { success, data }
      } = await TrackService.queryTraceFlowManage({
        traceId: state.traceId,
        id: record.id
      });
    if (success) {
      if (data) {
        setState({
          data: changeNodes(state.data, record.id, data.traces)
        });
      }
    }
  };
  
    /**
     * @name 替换子节点
     */
  function changeNodes(data, id, node) {
    data.map(item => {
      if (item.id === id) {
        item.traceNodes = node;
      }
      if (item.traceNodes) {
        changeNodes(item.traceNodes, id, node);
      }
    });
  
    return data;
  }
  
  const requestHeadList = [
    {
      label: '机器IP',
      value: state.host
    },
    {
      label: '开始时间',
      value: state.startTime
    },
    {
      label: '耗时',
      value: state.cost ? `${state.cost}ms` : null
    }
  ];

  const exportToPDF = async () => {
    const contentCanvas = await html2canvas(contentRef.current, {
      backgroundColor: 'white',
      scale: 1, // 调整 scale 参数以适应内容宽度
    });
  
    const pdf = new jsPDF('p', 'pt', [contentCanvas.width, contentCanvas.height]);
    pdf.addImage(contentCanvas.toDataURL('image/png'), 'PNG', 0, 0, contentCanvas.width, contentCanvas.height);
    pdf.save(`请求详情：${traceId}`);
  };

  return (
      <CommonModal
        modalProps={{
          width: 'calc(100% - 100px)',
          footer: null,
          maskClosable: false,
          centered: true,
          title: (
            <p style={{ fontSize: 16 }}>
              请求详情
              <Button  onClick={() => {exportToPDF(); }} style={{ float: 'right', marginRight: 20 }}>导出</Button>
            </p>
          ),
          getContainer: () => window.parent.document.body,
        }}
        btnProps={{ type: 'link' }}
        btnText={props.btnText}
        onClick={() => handleClick()}
      >
        <div
          ref={contentRef}
          style={{ height: document.body.clientHeight - 200, overflow: 'auto' }}
        >
          {/* <div style={{ marginBottom: 26 }}>
            <Header list={requestHeadList} isExtra={false} />
          </div> */}
          {state.data && state.data[0] && !state.loading ? (
            <div   className={styles.detailTable}>
              <CustomTable
                // style={{
                //   width: '210mm',
                //   padding: '20px',
                //   boxSizing: 'border-box',
                // }}
                rowKey="id"
                columns={getColumns()}
                size="small"
                dataSource={state.data}
                defaultExpandAllRows={false}
                defaultExpandedRowKeys={[
                  state.data && state.data[0] && state.data[0].id
                ]}
                childrenColumnName="traceNodes"
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
  isLive: false
};
  