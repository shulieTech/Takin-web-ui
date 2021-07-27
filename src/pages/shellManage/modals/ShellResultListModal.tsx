import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Divider, Pagination, Popover, Tag, Tooltip } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import ShellManageService from '../service';
interface Props {
  btnText?: string | React.ReactNode;
  scriptDeployId?: number | string;
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
const ShellResultListModal: React.FC<Props> = props => {
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
  const { scriptDeployId } = props;
  const { searchParams } = state;

  const handleClick = () => {
    queryWaringDetailList({ ...searchParams, scriptDeployId, type: 1 });
  };

  /**
   * @name 获取shell脚本执行结果列表
   */
  const queryWaringDetailList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await ShellManageService.queryShellResultList({
      ...value
    });
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

  const handleChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
    queryWaringDetailList({
      scriptDeployId,
      pageSize,
      current: current - 1,
      type: 1
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryWaringDetailList({
      scriptDeployId,
      pageSize,
      current: 0,
      type: 1
    });
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
        title: '版本',
        dataIndex: 'scriptVersion',
        render: text => {
          return <span>版本{text}</span>;
        }
      },
      {
        ...customColumnProps,
        title: '执行记录',
        dataIndex: 'result',
        width: 400,
        render: text => {
          return (
            <Tooltip
              title={
                <div style={{ maxHeight: 500, overflow: 'scroll' }}>{text}</div>}
            >
              <div className={styles.resultWrap}>{text}</div>
            </Tooltip>
          );
        }
      },
      {
        ...customColumnProps,
        title: '执行结果',
        dataIndex: 'success',
        render: text => {
          return <span>{text === true ? '成功' : '失败'}</span>;
        }
      },
      {
        ...customColumnProps,
        title: '操作人',
        dataIndex: 'executor'
      },
      {
        ...customColumnProps,
        title: '操作时间',
        dataIndex: 'gmtCreate'
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        width: 1096,
        footer: null,
        title: 'shell脚本执行列表'
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <div style={{ height: 500, overflowY: 'scroll', width: '100%' }}>
        <CustomTable
          rowKey={(row, index) => index.toString()}
          columns={getColumns()}
          size="small"
          dataSource={state.data ? state.data : []}
          loading={state.loading}
        />
      </div>
      <Pagination
        style={{ marginTop: 20, textAlign: 'right' }}
        total={state.total}
        current={state.searchParams.current + 1}
        pageSize={state.searchParams.pageSize}
        showTotal={(t, range) =>
          `共 ${state.total} 条数据 第${state.searchParams.current +
            1}页 / 共 ${Math.ceil(
            state.total / (state.searchParams.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) => handleChange(current, pageSize)}
        onShowSizeChange={handlePageSizeChange}
      />
    </CommonModal>
  );
};
export default ShellResultListModal;
