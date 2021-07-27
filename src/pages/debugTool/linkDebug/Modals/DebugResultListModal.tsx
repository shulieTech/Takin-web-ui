import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Button, message, Pagination } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import LinkDebugService from '../service';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import EmptyNode from 'src/common/empty-node';
import { Link } from 'umi';
interface Props {
  btnText?: string | React.ReactNode;
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
const DebugResultListModal: React.FC<Props> = props => {
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
    queryDebugResultList({ ...state.searchParams });
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
  const queryDebugResultList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await LinkDebugService.queryDebugResultList({ ...value });
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

  /**
   * @name 删除调试结果
   */
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await LinkDebugService.deleteDebugResult({ id });
    if (success) {
      message.success('删除调试结果成功！');
      queryDebugResultList({ ...state.searchParams });
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        dataIndex: 'id'
      },
      {
        ...customColumnProps,
        title: '调试名称',
        dataIndex: 'name'
      },
      {
        ...customColumnProps,
        title: '业务活动',
        dataIndex: 'businessLinkName'
      },
      {
        ...customColumnProps,
        title: '请求类型',
        dataIndex: 'httpMethod'
      },
      {
        ...customColumnProps,
        title: 'url',
        dataIndex: 'requestUrl'
      },
      {
        ...customColumnProps,
        title: '调试结果',
        dataIndex: 'debugResult'
      },
      {
        ...customColumnProps,
        title: '操作人',
        dataIndex: 'creatorName'
      },
      {
        ...customColumnProps,
        title: '发起调试时间',
        dataIndex: 'gmtCreate'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (text, row) => {
          return (
            <Fragment>
              <Link to={`/debugTool/linkDebug/detail?id=${row.id}`}>详情</Link>
              <CustomPopconfirm
                okText="确认删除"
                title={'是否确认删除当前调试历史'}
                okColor="var(--FunctionalError-500)"
                onConfirm={() => handleDelete(row.id)}
              >
                <Button type="link">删除</Button>
              </CustomPopconfirm>
            </Fragment>
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
    queryDebugResultList({ pageSize, current: current - 1 });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryDebugResultList({ pageSize, current: 0 });
  };

  return (
    <CommonModal
      modalProps={{
        width: 'calc(100% - 40px)',
        footer: null,
        title: '调试结果列表',
        centered: true
      }}
      btnProps={{
        type: 'ghost'
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
          <EmptyNode
            title="暂无调试历史哦"
            desc="暂无调试历史，您可以在调试面板「新建」调试配置，点击「开始调试」后，响应的调试结果会在这里展示哦～"
          />
        </div>
      )}
    </CommonModal>
  );
};
export default DebugResultListModal;
