import {
  Button,
  Col,
  Icon,
  Input,
  Pagination,
  Row,
  Switch
} from 'antd';
import moment from 'moment';
import { useStateReducer, CommonSelect } from 'racc';
import React, { Fragment, useEffect } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomTable from 'src/components/custom-table';
import AppManageService from '../service';
import styles from './../index.less';
import ApplicationMonitorList from './ApplicationMonitorList';

interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
}
interface State {
  isReload: boolean;
  total: number;
  List: any;
  refreshTime: number;
  detailLoading: any;
  reload: number;
  searchParams: {
    current: number;
    pageSize: number;
  };
  sorter: any;
  clusterTest: any;
}
const ApplicationMonitor: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    total: 0,
    reload: 0,
    List: [],
    refreshTime: 0,
    detailLoading: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    sorter: undefined,
    clusterTest: '-1',
  });
  const { Search } = Input;
  const { detailData, id, detailState, action } = props;
  useEffect(() => {
    queryBlackListList({ ...state.searchParams, orderBy: state.sorter, clusterTest: state.clusterTest });
  }, [state.searchParams.current, state.searchParams.pageSize, state.sorter, state.clusterTest, state.isReload]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (timer) {
      clearTimeout(timer);
    }
    const refreshData = () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (state.refreshTime) {
        timer = setTimeout(refreshData, state.refreshTime);
      }
      queryBlackListList({ ...state.searchParams, orderBy: state.sorter, clusterTest: state.clusterTest });
    };

    refreshData();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.reload, state.refreshTime]);

  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  /**
   * @name 获取黑名单列表
   */
  const queryBlackListList = async values => {
    setState({
      detailLoading: true
    });
    const {
      total,
      data: { success, data }
    } = await AppManageService.monitorDetailes({
      appName: detailData.applicationName,
      ...values
    });
    if (success) {
      setState({
        total,
        List: data,
        detailLoading: false
      });
      return;
    }
  };

  const handleChangePage = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };

  const onChange = (pagination, filters, sorter, extra) => {
    if (sorter.order) {
      if (sorter.order === 'ascend') {
        setState({ sorter: `${sorter.columnKey} asc` });
      } else {
        setState({ sorter: `${sorter.columnKey} desc` });
      }
    } else {
      setState({ sorter: undefined });
    }

  };

  const clusterTestChange = (value) => {
    setState({
      clusterTest: value
    });
  };

  return (
    <Fragment>
      <div
        className={styles.tableWrap}
        style={{ height: document.body.clientHeight - 160 }}
      >
        <Row type="flex" style={{ marginBottom: 20, marginTop: 20 }}>
          <Col span={7} offset={15} style={{ marginTop: 5 }}>
            <span>
              <span style={{ marginRight: 8 }}>
                最后统计时间：{moment().format('YYYY-MM-DD HH:mm:ss')}
              </span>
              5秒刷新一次
              <Switch
                size="small"
                style={{ marginLeft: 8 }}
                checked={state.refreshTime > 0}
                onChange={(val) => {
                  setState({
                    refreshTime: val ? 5000 : 0,
                  });
                }}
              />
            </span>
            <Icon
              title="刷新"
              spin={state.detailLoading}
              type="sync"
              style={{
                cursor: 'pointer',
                marginLeft: 8,
              }}
              onClick={() => {
                if (!state.detailLoading) {
                  setState({ reload: state.reload + 1 });
                }
              }}
            />
          </Col>
          <Col span={2}>
            <CommonSelect
              placeholder="流量类型"
              style={{ width: '95%' }}
              onChange={clusterTestChange}
              defaultValue="-1"
              dataSource={
              [{ value: '-1', label: '混合流量', num: 1, disable: false },
                { value: '0', label: '业务流量', num: 1, disable: false },
                { value: '1', label: '压测流量', num: 1, disable: false }]}
            />
          </Col>
        </Row>

        <CustomTable
          rowKey="blistId"
          onChange={onChange}
          columns={ApplicationMonitorList(
            state,
            setState,
            detailState,
            id,
            action,
            detailData
          )}
          dataSource={state.List ? state.List : []}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          // textAlign: 'right',
          position: 'fixed',
          padding: '8px 40px',
          bottom: 0,
          right: 10,
          width: 'calc(100% - 178px)',
          backgroundColor: '#fff',
          boxShadow:
            '0px 2px 20px 0px rgba(92,80,133,0.15),0px -4px 8px 0px rgba(222,223,233,0.3)'
        }}
      >
        <Pagination
          style={{ display: 'inline-block', float: 'right' }}
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
          onChange={(current, pageSize) => handleChangePage(current, pageSize)}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </Fragment>
  );
};
export default ApplicationMonitor;