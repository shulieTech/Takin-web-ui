/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import { AgentManageContext } from '../indexPage';
import AgentManageService from '../service';
import { Button, Col, Icon, Pagination, Row } from 'antd';
import Search from 'antd/lib/input/Search';
import { CommonSelect, ImportFile } from 'racc';
import CustomTable from 'src/components/custom-table';
import getAgentManageColumns from './AgentManageColumns';
import EmptyNode from 'src/common/empty-node/EmptyNode';
import { connect } from 'dva';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { MapBtnAuthority } from 'src/utils/utils';
interface Props {
  dictionaryMap?: any;
}

const AgentManageSearchAndTable: React.FC<Props> = props => {
  const { state, setState } = useContext(AgentManageContext);

  const { dictionaryMap } = props;
  const { agent_status, agent_probe_status } = dictionaryMap;

  useEffect(() => {
    queryAgentManageList({
      ...state.searchParams,
      agentStatus: state.agentStatus,
      projectName: state.searchInputValue,
      probeStatus: state.probeStatus
    });
  }, [
    state.isReload,
    state.agentStatus,
    state.probeStatus,
    state.searchParams.current,
    state.searchParams.pageSize,
    state.searchInputValue
  ]);

  /**
   * @name 获取探针列表
   */
  const queryAgentManageList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await AgentManageService.queryAgentManageList({
      ...value
    });
    if (success) {
      setState({
        total,
        agentManageList: data,
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
      agentStatus: value,
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
    });
  };

  const handleChangeProbeStatus = async value => {
    setState({
      probeStatus: value,
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
        overflow: 'scroll'
      }}
    >
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        <Col span={6}>
          <CommonSelect
            style={{ width: '100%' }}
            placeholder="搜索应用名称"
            dataSource={state.allAppList || []}
            value={state.searchInputValue}
            onChange={value => {
              setState({
                searchInputValue: value
              });
            }}
            showSearch
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          />
        </Col>
        <Col>
          <Button
            type="link"
            style={{ marginRight: 16 }}
            onClick={() => {
              setState({
                searchInputValue: undefined,
                agentStatus: undefined,
                probeStatus: undefined,
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
            placeholder="agent状态:全部"
            style={{ width: 140, marginRight: 16 }}
            dataSource={agent_status || []}
            onChange={handleChangeStatus}
            value={state.agentStatus}
          />
          <CommonSelect
            placeholder="探针状态:全部"
            style={{ width: 140, marginRight: 16 }}
            dataSource={agent_probe_status || []}
            onChange={handleChangeProbeStatus}
            value={state.probeStatus}
          />
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
      {(!state.agentManageList || state.agentManageList.length === 0) &&
      !state.agentStatus &&
      !state.probeStatus &&
      !state.searchInputValue ? (
        <div>
          <EmptyNode
            title="暂无探针,请先接入应用"
            desc="您需要至少接入一台服务节点，才能使用Takin哦～"
            extra={
              <AuthorityBtn
                isShow={
                  MapBtnAuthority('appManage_appAccess_7_download') ||
                  MapBtnAuthority('appManage_appAccess_2_create')
                }
              >
                <Button
                  style={{ marginTop: 8 }}
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    setState({
                      visible: true
                    });
                  }}
                >
                  接入第一个应用
                </Button>
              </AuthorityBtn>
            }
          />
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            height: 'calc(100% - 75px)',
            overflow: 'scroll'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 'calc(100% - 30px)',
              overflow: 'scroll'
            }}
          >
            <CustomTable
              rowKey={(row, index) => index.toString()}
              loading={state.loading}
              columns={getAgentManageColumns(state, setState)}
              dataSource={state.agentManageList || []}
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
      )}
    </div>
  );
};
export default connect(({ common }) => ({ ...common }))(
  AgentManageSearchAndTable
);
