import React, { Fragment, useEffect } from 'react';
import { CommonSelect, useStateReducer } from 'racc';
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
import { connect } from 'dva';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import customStyles from './../../../custom.less';
import getMiddlewareListColumns from './MiddlewareListColumn';
import ImportFileModal from 'src/common/import-file-modal/ImportFileModal';

interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
  dictionaryMap?: any;
}
interface State {
  isReload: boolean;
  middlewareList: any[];
  loading: boolean;
  total: number;
  searchParams: {
    current: number;
    pageSize: number;
  };
  middlewareDashboard: any;
  searchInputValue: string;
  status: string;
  visible: boolean;
  compareStatus: 'loading' | 'success' | 'fail';
}
const MiddlewareList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    middlewareList: null,
    loading: false,
    total: 0,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    middlewareDashboard: {} as any,
    searchInputValue: null,
    status: undefined,
    visible: false,
    compareStatus: null
  });
  const { Search } = Input;

  const { id, dictionaryMap } = props;
  const { MIDDLEWARE_STATUS } = dictionaryMap;

  const { middlewareDashboard } = state;

  const alertData = [
    {
      label: '总数',
      value: middlewareDashboard.totalCount,
      color: customStyles.alertValueNormal
    },
    {
      label: '已支持',
      value: middlewareDashboard.supportedCount,
      color: customStyles.alertValueNormal
    },
    {
      label: '未支持',
      value: middlewareDashboard.notSupportedCount,
      color:
        middlewareDashboard.notSupportedCount > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    },

    {
      label: '未知',
      value: middlewareDashboard.unknownCount,
      color:
        middlewareDashboard.unknownCount > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    },
    {
      label: '无需支持',
      value: middlewareDashboard.noSupportRequiredCount,
      color: customStyles.alertValueNormal
    }
  ];

  useEffect(() => {
    queryMiddlewareDashboard();
  }, []);

  useEffect(() => {
    queryMiddlewareList({
      ...state.searchParams,
      keywords: state.searchInputValue,
      status: state.status
    });
  }, [
    state.isReload,
    state.searchParams.current,
    state.searchParams.pageSize,
    state.status
  ]);

  /**
   * @name 获取中间件列表
   */
  const queryMiddlewareList = async values => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await AppManageService.queryMiddlewareList({
      applicationId: id,
      ...values
    });
    if (success) {
      setState({
        total,
        middlewareList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取中间件概况
   */
  const queryMiddlewareDashboard = async () => {
    const {
      data: { success, data }
    } = await AppManageService.queryMiddlewareDashboard({
      applicationId: id
    });
    if (success) {
      setState({
        middlewareDashboard: data
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

  const handleChangeStatus = async value => {
    setState({
      status: value,
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
    });
  };

  /**
   * @name 重新对比
   */
  const handleCompare = async () => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await AppManageService.compare({
      applicationId: id
    });
    if (success) {
      setState({
        loading: false,
        isReload: !state.isReload
      });
      return;
    }
    setState({
      loading: false
    });
  };

  return (
    <Fragment>
      <div
        className={styles.tableWrap}
        style={{ height: document.body.clientHeight - 160 }}
      >
        <CustomAlert
          message
          showIcon
          types="info"
          title="中间件支持概况"
          content={
            <div style={{ display: 'inline-block', marginLeft: 16 }}>
              {alertData.map((item, k) => {
                return (
                  <span key={k} style={{ marginRight: 16 }}>
                    <span
                      className={customStyles.alertLabel}
                      style={{ marginRight: 8 }}
                    >
                      {item.label}
                    </span>
                    <span className={item.color}>{item.value}</span>
                  </span>
                );
              })}
            </div>}
        />
        {/* {state.visible && (
          <ImportFileModal
            fileName="文件名称.csv"
            fileTitle={'中间件比对'}
            visible={true}
            status={state.compareStatus}
            footerTxt={
              state.compareStatus === 'loading'
                ? '文件对比中，请稍后...'
                : state.compareStatus === 'fail'
                ? '请在下载文件中查看失败明细'
                : ''
            }
            footerBtnTxt={state.compareStatus !== 'loading' ? '完成' : null}
            extraNode={
              true ? (
                <p className={styles.desc}>
                  比对成功，发现中间件「 未支持 」
                  <span className={styles.errorColor}>35</span> 条，「 未知 」
                  <span className={styles.errorColor}>23</span> 条
                </p>
              ) : (
                <p className={styles.desc}>
                  比对成功，未发现「未支持」或「未知」中间件
                </p>
              )
            }
            onBtnClick={() => {
              setState({
                visible: false,
                compareStatus: null
              });
            }}
            onCancel={() => {
              setState({
                visible: false,
                compareStatus: null
              });
            }}
          />
        )} */}

        <Row
          type="flex"
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          <Col span={6}>
            <Search
              placeholder="搜索Artifact ID、Group ID"
              enterButton
              onSearch={() =>
                setState({
                  isReload: !state.isReload,
                  searchParams: {
                    pageSize: state.searchParams.pageSize,
                    current: 0
                  }
                })
              }
              onChange={e =>
                setState({
                  searchInputValue: e.target.value
                })
              }
              value={state.searchInputValue}
            />
          </Col>
          <Col>
            <Button
              type="link"
              style={{ marginRight: 16 }}
              onClick={() => {
                setState({
                  searchInputValue: null,
                  status: undefined,
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
            <CommonSelect
              placeholder="状态:全部"
              style={{ width: 140, marginRight: 16 }}
              dataSource={MIDDLEWARE_STATUS || []}
              onChange={handleChangeStatus}
              value={state.status}
            />
            <Button style={{ marginRight: 16 }} onClick={handleCompare}>
              重新比对
            </Button>
            <Icon
              onClick={() => {
                setState({
                  isReload: !state.isReload,
                  searchParams: {
                    current: 0,
                    pageSize: 10
                  }
                });
              }}
              type="redo"
            />
          </Col>
        </Row>
        <CustomTable
          rowKey={(row, index) => index.toString()}
          loading={state.loading}
          columns={getMiddlewareListColumns(state, setState, props.id)}
          dataSource={state.middlewareList || []}
        />
      </div>
      <div
        style={{
          marginTop: 20,
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
export default connect(({ common }) => ({ ...common }))(MiddlewareList);
