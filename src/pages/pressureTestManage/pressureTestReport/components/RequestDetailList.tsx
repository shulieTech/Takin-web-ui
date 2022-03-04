import { ColumnProps } from 'antd/lib/table';
import { CommonTable, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import RequestDetailModal from '../modals/RequestDetailModal';
import { message, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import AssertModal from 'src/pages/scriptManage/modals/AssertModal';
import Header from 'src/common/header/Header';
interface Props {
  dataSource: any;
  reportId?: string;
}
interface State {
  data: any;
  loading: boolean;
}
const RequestDetailList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    data: null,
    loading: false
  });

  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const getRequestListColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '请求入口',
        dataIndex: 'interfaceName'
      },
      // {
      //   ...customColumnProps,
      //   title: '应用（IP）',
      //   dataIndex: 'applicationName'
      // },
      {
        ...customColumnProps,
        title: '结果',
        dataIndex: 'responseStatusDesc'
      },
      {
        ...customColumnProps,
        title: '请求体',
        dataIndex: 'requestBody',
        ellipsis: true,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'scroll' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <span>{text}</span>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '响应体/异常',
        dataIndex: 'responseBody',
        ellipsis: true,
        render: text => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'scroll' }}>
                  <div style={{ textAlign: 'right' }}>
                    <a onClick={() => handleCopy(text)}>复制</a>
                  </div>
                  {text}
                </div>}
            >
              <span>{text}</span>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        }
      },
      {
        ...customColumnProps,
        title: '总耗时（ms）',
        dataIndex: 'totalRt'
      },
      {
        ...customColumnProps,
        title: '开始时间',
        dataIndex: 'startTime'
      },
      {
        ...customColumnProps,
        title: 'TraceID',
        dataIndex: 'traceId'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <Fragment>
              <RequestDetailModal
                reportId={props.reportId}
                isLive={true}
                btnText="请求详情"
                traceId={row.traceId}
                totalRt={row.totalRt}
              />
              {row.responseStatus !== 0 && row.responseStatus !== 200 && (
                <span style={{ marginLeft: 8 }}>
                  <AssertModal
                    btnText="断言详情"
                    dataSource={row.assertDetailList}
                  />
                </span>
              )}
            </Fragment>
          );
        }
      }
    ];
  };
  return (
    <Fragment>
      <Header title="请求流量明细" />
      <CommonTable
        size="small"
        style={{ marginTop: 8 }}
        columns={getRequestListColumns()}
        dataSource={props.dataSource ? props.dataSource : []}
      />
    </Fragment>
  );
};
export default RequestDetailList;
