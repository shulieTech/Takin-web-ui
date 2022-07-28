/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import { BusinessFlowContext } from '../indexPage';
import BusinessFlowService from '../service';
import { Button, Col, Icon, Pagination, Row } from 'antd';
import Search from 'antd/lib/input/Search';
import { CommonSelect, ImportFile } from 'racc';
import CustomTable from 'src/components/custom-table';
import { connect } from 'dva';
import styles from './../index.less';
import getBusinessFlowColumns from './BusinessFlowColumns';
interface Props {
  dictionaryMap?: any;
}
declare var serverUrl;
const BusinessFlowSearchAndTable: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessFlowContext);

  const { dictionaryMap } = props;
  const { MIDDLEWARE_STATUS } = dictionaryMap;

  useEffect(() => {
    queryBusinessFlowList({
      ...state.searchParams,
      businessFlowName: state.businessFlowName
    });
  }, [state.isReload, state.searchParams.current, state.searchParams.pageSize]);

  /**
   * @name 获取业务流程列表
   */
  const queryBusinessFlowList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await BusinessFlowService.queryBusinessFlowList({
      ...value
    });
    if (success) {
      setState({
        total,
        businessFlowList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
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

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100%)',
        overflow: 'auto'
      }}
    >
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        <Col span={6}>
          <Search
            placeholder="搜索业务流程"
            enterButton
            onSearch={(val) =>
              setState({
                isReload: !state.isReload,
                businessFlowName: val,
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
                businessFlowName: null,
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
              queryBusinessFlowList({
                ...state.searchParams,
                businessFlowName: state.businessFlowName
              });
              // setState({
              //   searchInputValue: null,
              //   isReload: !state.isReload,
              //   searchParams: {
              //     current: 0,
              //     pageSize: 10
              //   }
              // });
            }}
            type="redo"
          />
        </Col>
      </Row>

      <div
        style={{
          position: 'relative',
          height: 'calc(100% - 75px)',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 'calc(100% - 30px)',
            overflow: 'auto'
          }}
        >
          <CustomTable
            rowKey={(row, index) => index.toString()}
            loading={state.loading}
            columns={getBusinessFlowColumns(state, setState)}
            dataSource={state.businessFlowList || []}
            style={{ paddingBottom: 30 }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            padding: '8px 16px',
            bottom: 0,
            right: 0,
            width: '100%',
            background: '#fff'
          }}
        >
          <Pagination
            style={{
              float: 'right'
            }}
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
            onChange={(current, pageSize) =>
              handleChangePage(current, pageSize)
            }
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};
export default connect(({ common }) => ({ ...common }))(
  BusinessFlowSearchAndTable
);
