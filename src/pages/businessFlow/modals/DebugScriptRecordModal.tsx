import React, { Fragment, useEffect } from 'react';
import { CommonModal, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Pagination } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import EmptyNode from 'src/common/empty-node';
import ScriptManageService from '../service';
import { Link } from 'umi';
import downloadFile from 'src/utils/downloadFile';

interface Props {
  btnText?: string | React.ReactNode;
  id: number;
  scriptDeployId: string;
}

interface State {
  isReload?: boolean;
  searchParams: {
    current: number;
    pageSize: number;
  };
  data: any[];
  total?: number;
  loading: boolean;
}
const DebugScriptRecordModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    data: null,
    total: 0,
    loading: false
  });

  const handleClick = () => {
    queryDebugScriptRecordList({
      ...state.searchParams,
      scriptDeployId: props.scriptDeployId
    });
  };

  const handleCancle = () => {
    setState({
      searchParams: {
        current: 0,
        pageSize: 10
      },
      data: null,
      total: 0
    });
  };

  /**
   * @name 获取调试结果历史列表
   */
  const queryDebugScriptRecordList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await ScriptManageService.queryDebugScriptRecordList({ ...value });
    if (success) {
      setState({
        data,
        total,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const downloadJtl = async (row) => {
    const {
      data: { data, success },
    } = await ScriptManageService.getJtlDownLoadUrl({
      reportId: row.cloudReportId,
    });
    if (success && typeof data.content === 'string') {
      const filePath: string = data.content;
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
      downloadFile(filePath, fileName);
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '调试条数',
        dataIndex: 'requestNum'
      },
      {
        ...customColumnProps,
        title: '调试时间',
        dataIndex: 'createdAt'
      },
      {
        ...customColumnProps,
        title: '调试结果',
        dataIndex: 'status',
        render: text => {
          return (
            <Badge
              text={text === 4 ? '成功' : '失败'}
              color={text === 4 ? '#BBBBBB' : '#FF846A'}
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '异常',
        dataIndex: 'remark',
        width: 200,
        ellipsis: true
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <>
              <Link
                to={`/scriptManage/scriptDebugDetail?id=${row.id}&reportId=${row.cloudReportId}`}
              >
                调试详情
              </Link>
              {row.cloudReportId && <a onClick={() => downloadJtl(row)} style={{ marginLeft: 8 }}>下载jtl</a>}
            </>
          );
        }
      }
    ];
  };

  const handleChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
    queryDebugScriptRecordList({
      pageSize,
      current: current - 1,
      scriptDeployId: props.scriptDeployId
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryDebugScriptRecordList({
      pageSize,
      current: 0,
      scriptDeployId: props.scriptDeployId
    });
  };

  return (
    <CommonModal
      modalProps={{
        width: 900,
        footer: null,
        title: '调试历史记录',
        centered: true
      }}
      btnProps={{
        type: 'link'
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      afterCancel={() => {
        handleCancle();
      }}
    >
      {state.data && state.data.length > 0 ? (
        <div
          style={{
            height: document.body.offsetHeight - 200
          }}
        >
          <div
            style={{
              position: 'relative',
              overflow: 'scroll',
              paddingBottom: 50,
              height: document.body.offsetHeight - 250
            }}
          >
            <CustomTable
              rowKey={(row, index) => index.toString()}
              columns={getColumns()}
              size="small"
              dataSource={state.data ? state.data : []}
              loading={state.loading}
            />
          </div>

          <div
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
          >
            <Pagination
              style={{ marginTop: 20, textAlign: 'right', background: '#fff' }}
              total={state.total}
              current={state.searchParams.current + 1}
              pageSize={state.searchParams.pageSize}
              showTotal={(t, range) =>
                `共 ${state.total} 条数据 第${state.searchParams.current +
                  1}页 / 共 ${Math.ceil(
                  state.total / (state.searchParams.pageSize || 10)
                )}页`
              }
              size="small"
              showSizeChanger={true}
              onChange={(current, pageSize) => handleChange(current, pageSize)}
              onShowSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      ) : (
        <div style={{ minHeight: 500, paddingTop: 100 }}>
          <EmptyNode title="暂无调试历史哦" />
        </div>
      )}
    </CommonModal>
  );
};
export default DebugScriptRecordModal;
