/* eslint-disable react-hooks/exhaustive-deps */
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
  Tabs,
  message
} from 'antd';
import styles from './../index.less';
import AppManageService from '../service';
import getMockListColumns from './MockListColumn';
import { connect } from 'dva';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import MockConfigModal from '../modals/MockConfigModal';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';

interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
  dictionaryMap?: any;
}
interface State {
  isReload: boolean;
  mockList: any[];
  loading: boolean;
  interfaceName: string;
  total: number;
  searchParams: {
    current: number;
    pageSize: number;
  };
  type: string;
  errorCount: number;
  selectedRowKeys: any;
  selectedRows: any;
}
const MockList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    mockList: null,
    loading: false,
    interfaceName: null,
    total: 0,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    type: undefined,
    errorCount: 0,
    selectedRowKeys: [],
    selectedRows: [],
  });
  const { Search } = Input;

  const { id } = props;
  const { dictionaryMap } = props;
  const { REMOTE_CALL_CONFIG_TYPE } = dictionaryMap;

  useEffect(() => {
    queryErrorCount();
  }, []);

  useEffect(() => {
    queryMockList({
      ...state.searchParams,
      interfaceName: state.interfaceName,
      type: state.type
    });
  }, [
    state.isReload,
    state.searchParams.current,
    state.searchParams.pageSize,
    state.type
  ]);

  /**
   * @name 获取远程调用列表
   */
  const queryMockList = async values => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await AppManageService.queryMockList({
      applicationId: id,
      ...values
    });
    if (success) {
      setState({
        total,
        mockList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取远程调用异常数
   */
  const queryErrorCount = async () => {
    const {
      data: { success, data }
    } = await AppManageService.getErrorCount({
      applicationId: id
    });
    if (success) {
      setState({
        errorCount: data.content
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

  const handleChangeType = async value => {
    setState({
      type: value,
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
    });
  };
  const onSelectChange = (selectedRowKey, selectedRow) => {
    setState({
      selectedRowKeys: selectedRowKey,
      selectedRows: selectedRow
    });
  };
  const handleJoin = async (selectedRowKey) => {
    const arr = [];
    selectedRowKey.map(ite => {
      const obj = {
        id: {}, isManual: {}, applicationId: {},
        interfaceName: {}, interfaceType: {}, serverAppName: {}, remark: {}, type: {}
      };
      obj.id = ite.id;
      obj.isManual = ite.isManual;
      obj.applicationId = props.id;
      obj.interfaceName = ite.interfaceName;
      obj.interfaceType = ite.interfaceChildType;
      obj.serverAppName = ite.serverAppName;
      obj.remark = ite.remark;
      obj.type = ite.typeSelectVO && ite.typeSelectVO.value;
      arr.push(obj);
    });
    const {
      data: { success, data }
    } = await AppManageService.updateBatch({
      updateInfos: arr,
      updateType: 1
    });
    if (success) {
      message.success('批量加入白名单成功');
      setState({
        isReload: !state.isReload,
        selectedRowKeys: [],
        selectedRows: [],
        searchParams: {
          pageSize: state.searchParams.pageSize,
          current: 0
        }
      });
    }
  };
  const handleCancel = async (selectedRowKey) => {
    const arr = [];
    selectedRowKey.map(ite => {
      const obj = {
        id: {}, isManual: {}, applicationId: {},
        interfaceName: {}, interfaceType: {}, serverAppName: {}, remark: {}, type: {}
      };
      obj.id = ite.id;
      obj.isManual = ite.isManual;
      obj.applicationId = props.id;
      obj.interfaceName = ite.interfaceName;
      obj.interfaceType = ite.interfaceChildType;
      obj.serverAppName = ite.serverAppName;
      obj.remark = ite.remark;
      obj.type = ite.typeSelectVO && ite.typeSelectVO.value;
      arr.push(obj);
    });
    const {
      data: { success, data }
    } = await AppManageService.updateBatch({
      updateInfos: arr,
      updateType: 0
    });
    if (success) {
      message.success('批量取消白名单成功');
      setState({
        isReload: !state.isReload,
        selectedRowKeys: [],
        selectedRows: [],
        searchParams: {
          pageSize: state.searchParams.pageSize,
          current: 0
        }
      });
    }
  };
  const { selectedRowKeys } = state;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: record => ({
      disabled: record.typeSelectVO.label !== '白名单' && record.typeSelectVO.label !== '未配置',
      label: record.typeSelectVO.label,
    }),
  };

  return (
    <Fragment>
      <div
        className={styles.tableWrap}
        // style={{ height: document.body.clientHeight - 200 }}
      >
        {state.errorCount > 0 && (
          <CustomAlert
            types="error"
            title="远程调用配置示警"
            message
            content={
              <p style={{ display: 'inline-block', marginLeft: 16 }}>
                <span>
                  存在
                  <span className={styles.nodenum} style={{ color: '#ED6047' }}>
                    {state.errorCount}
                  </span>
                  个远程接口无服务端应用，但已配置白名单，请及时处理
                </span>
              </p>}
            showIcon={true}
          />
        )}

        <Row
          type="flex"
          justify="space-between"
          align="middle"
          style={{ marginBottom: 20, marginTop: 20 }}
        >
          <Col span={6}>
            <Search
              placeholder="搜索接口名称"
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
                  interfaceName: e.target.value
                })
              }
              value={state.interfaceName}
            />
          </Col>
          <Col>
            <Button
              type="link"
              style={{ marginRight: 16 }}
              onClick={() => {
                setState({
                  interfaceName: null,
                  type: undefined,
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
              placeholder="配置类型:全部"
              style={{ width: 140, marginRight: 16 }}
              dataSource={REMOTE_CALL_CONFIG_TYPE || []}
              onChange={handleChangeType}
              value={state.type}
            />
            <Icon
              onClick={() => {
                setState({
                  interfaceName: state.interfaceName,
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
        <Row type="flex" justify="end">
          <MockConfigModal
            btnText="新增远程调用"
            action="add"
            applicationId={id}
            onSccuess={() => {
              setState({
                isReload: !state.isReload
              });
            }}
          />
        </Row>
        <CustomTable
          loading={state.loading}
          columns={getMockListColumns(state, setState, props.id)}
          dataSource={state.mockList || []}
          rowKey="md5"
          rowSelection={rowSelection}
        />
      </div>
      <div
        style={{
          marginTop: 20,
          // textAlign: 'right',
          position: 'fixed',
          zIndex: 1,
          padding: '8px 40px',
          bottom: 0,
          right: 10,
          width: 'calc(100% - 178px)',
          backgroundColor: '#fff',
          boxShadow:
            '0px 2px 20px 0px rgba(92,80,133,0.15),0px -4px 8px 0px rgba(222,223,233,0.3)'
        }}
      >
        <CustomPopconfirm
          title="是否确定加入白名单？"
          okColor="var(--FunctionalError-500)"
          onConfirm={() => handleJoin(state.selectedRows)}
          disabled={state.selectedRowKeys.length > 0 ? false : true}
        >
          <span
            style={{
              color: state.selectedRowKeys.length > 0 ?
                '#11bbd5' : 'var(--Netural-06)',
              cursor: state.selectedRowKeys.length > 0 ?
                'pointer' : 'default',
              margin: '0 15px'
            }}
          > 批量加入白名单
          </span>
        </CustomPopconfirm>
        <CustomPopconfirm
          title="是否确定取消白名单？"
          okColor="var(--FunctionalError-500)"
          onConfirm={() => handleCancel(state.selectedRows)}
          disabled={state.selectedRowKeys.length > 0 ? false : true}
        >
          <span
            style={{
              color: state.selectedRowKeys.length > 0 ?
                '#11bbd5' : 'var(--Netural-06)',
              cursor: state.selectedRowKeys.length > 0 ?
                'pointer' : 'default',
              margin: '0 15px'
            }}
          > 批量取消白名单
          </span>
        </CustomPopconfirm>
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
export default connect(({ common }) => ({ ...common }))(MockList);
