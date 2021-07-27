import React, { Fragment, useEffect } from 'react';
import { useStateReducer } from 'racc';
import CustomTable from 'src/components/custom-table';
import {
  Divider,
  Pagination,
  Checkbox,
  Row,
  Col,
  Button,
  Input,
  Icon,
  Tabs
} from 'antd';
import styles from './../index.less';
import AppManageService from '../service';
import getNodeManageListColumns from './NodeManageListColumn';
import CustomAlert from 'src/common/custom-alert/CustomAlert';

interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
}
interface State {
  isReload: boolean;
  nodeManageList: any[];
  loading: boolean;
  ip: string;
  total: number;
  searchParams: {
    current: number;
    pageSize: number;
  };
  nodeNum: number;
  onlineNodeNum: number;
  probeInstalledNodeNum: number;
  errorMsg: string;
  tabKey: string;
}
const NodeManageList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    nodeManageList: null,
    loading: false,
    ip: null,
    total: 0,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    nodeNum: null,
    onlineNodeNum: null,
    probeInstalledNodeNum: null,
    errorMsg: null,
    tabKey: '2'
  });
  const { Search } = Input;

  const { id } = props;

  useEffect(() => {
    queryNodeNum();
  }, [state.isReload, state.tabKey]);

  useEffect(() => {
    queryNodeManageList({
      ip: state.ip,
      ...state.searchParams,
      type: state.tabKey === '2' ? '' : state.tabKey
    });
  }, [
    state.isReload,
    state.searchParams.current,
    state.searchParams.pageSize,
    state.tabKey
  ]);

  /**
   * @name 安装、卸载、升级中轮询列表
   */
  useEffect(() => {
    let timer = null;

    timer = setInterval(() => {
      if (
        state.nodeManageList &&
        state.nodeManageList.filter((item, k) => {
          if (
            item.probeStatus === 1 ||
            item.probeStatus === 11 ||
            item.probeStatus === 21
          ) {
            return item;
          }
        }).length > 0
      ) {
        queryNodeManageListRepeat({
          ip: state.ip,
          ...state.searchParams,
          type: state.tabKey === '2' ? '' : state.tabKey
        });
        queryNodeNum();
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [state.nodeManageList]);

  /**
   * @name 获取节点数
   */
  const queryNodeNum = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryNodeNum({
      applicationId: id
    });
    if (success) {
      setState({
        nodeNum: data.allNodeNum,
        onlineNodeNum: data.onlineNodeNum,
        errorMsg: data.errorMsg,
        probeInstalledNodeNum: data.probeInstalledNodeNum
      });
    }
  };

  /**
   * @name 获取节点列表
   */
  const queryNodeManageList = async values => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await AppManageService.queryNodeManageList({
      applicationId: id,
      ...values
    });
    if (success) {
      setState({
        total,
        nodeManageList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取节点列表（轮询）
   */
  const queryNodeManageListRepeat = async values => {
    const {
      total,
      data: { success, data }
    } = await AppManageService.queryNodeManageList({
      applicationId: id,
      ...values
    });
    if (success) {
      setState({
        total,
        nodeManageList: data
      });
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

  const handleChangeTab = async value => {
    setState({
      tabKey: value,
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
    });
  };

  const tabsData = [
    {
      label: '全部',
      key: '2'
    },
    {
      label: '已安装',
      key: '1'
    },
    {
      label: '未安装',
      key: '0'
    }
  ];

  return (
    <Fragment>
      <div
        className={styles.tableWrap}
        style={{ height: document.body.clientHeight - 160 }}
      >
        <CustomAlert
          types={state.errorMsg ? 'error' : 'info'}
          title="探针概况"
          message
          content={
            <p style={{ display: 'inline-block', marginLeft: 16 }}>
              <span>
                节点总数 <span className={styles.nodenum}>{state.nodeNum}</span>
                个
              </span>
              <span style={{ marginLeft: 16 }}>
                在线节点
                <span className={styles.nodenum}>{state.onlineNodeNum}</span> 个
              </span>
              <span style={{ marginLeft: 16 }}>
                已安装节点
                <span className={styles.nodenum}>
                  {state.probeInstalledNodeNum}
                </span>
                个
              </span>
              {state.errorMsg && (
                <span style={{ marginLeft: 16, color: '#ED6047' }}>
                  | {state.errorMsg}
                </span>
              )}
            </p>}
          showIcon={true}
        />
        <Row
          type="flex"
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          <Col span={6}>
            <Search
              placeholder="搜索IP地址"
              enterButton
              onSearch={() =>
                setState({
                  isReload: !state.isReload
                })
              }
              onChange={e =>
                setState({
                  ip: e.target.value
                })
              }
              value={state.ip}
            />
          </Col>
          <Col>
            <Button
              type="link"
              style={{ marginRight: 16 }}
              onClick={() => {
                setState({
                  ip: null,
                  isReload: !state.isReload,
                  searchParams: {
                    current: 0,
                    pageSize: 10
                  }
                });
              }}
            >
              重置
            </Button>
            <Icon
              onClick={() => {
                setState({
                  ip: null,
                  isReload: !state.isReload,
                  searchParams: {
                    current: 0,
                    pageSize: 10
                  },
                  tabKey: '2'
                });
              }}
              type="redo"
            />
          </Col>
        </Row>
        <Tabs activeKey={state.tabKey} onChange={handleChangeTab}>
          {tabsData.map((item, k) => {
            return (
              <Tabs.TabPane tab={item.label} key={item.key}>
                <CustomTable
                  rowKey="agentId"
                  loading={state.loading}
                  columns={getNodeManageListColumns(
                    state,
                    setState,
                    props.detailData
                  )}
                  dataSource={state.nodeManageList ? state.nodeManageList : []}
                />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
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
export default NodeManageList;
