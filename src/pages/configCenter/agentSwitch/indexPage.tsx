import React, { Fragment, useEffect } from 'react';
import styles from './index.less';
import { Alert, Icon } from 'antd';
import SwitchBar from './components/SwitchBar';
import { useStateReducer } from 'racc';
import SkeletonLoading from 'src/common/loading/SkeletonLoading';
import AgentSwitchService from './service';
import InoperativeNodeModal from './modals/InoperativeNodeModal';
import AgentManageService from 'src/pages/agentManage/service';
interface Props {}
interface State {
  isReload: false;
  switchStatus: string;
  statusInfo: string;
  dataSource: any;
  loading: boolean;
  inoperativeNodeData: any[];
  searchInputValue: string;
  canEnableDisable: any;
}
const AgentSwitch: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    switchStatus: null,
    statusInfo: '',
    dataSource: [],
    loading: false,
    inoperativeNodeData: [],
    searchInputValue: undefined,
    canEnableDisable: false
  });

  useEffect(() => {
    querySwitchStatus();
    queryInoperativeNode({ bizType: 0, appName: state.searchInputValue });
  }, [state.isReload]);

  /**
   * @name 获取未生效应用节点
   */
  const queryInoperativeNode = async value => {
    const {
      data: { success, data }
    } = await AgentSwitchService.queryInoperativeNode({
      ...value
    });
    if (success) {
      setState({
        inoperativeNodeData: data
      });
    }
  };

  /**
   * @name 获取agent开关状态
   */
  const querySwitchStatus = async () => {
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await AgentSwitchService.queryAgentSwitchStatus({});
    if (success) {
      setState({
        switchStatus: data.switchStatus,
        statusInfo:
          data.switchStatus === 'OPENED'
            ? '探针已启用，压测配置已生效，确认各项压测配置正常后可进行安全压测'
            : '探针已关闭，探针将不区分压测流量，且无法采集监控日志。无法从平台发起压测流量的压测和调试',
        loading: false,
        canEnableDisable: data.canEnableDisable
      });
    }
    setState({
      loading: false
    });
  };
  return state.loading ? (
    <SkeletonLoading />
  ) : (
    <div style={{ padding: '24px 16px' }}>
      <div className={styles.title}>
        探针总开关{' '}
        <InoperativeNodeModal
          state={state}
          setState={setState}
          btnText={
            <Fragment>
              <span
                style={{
                  color:
                    state.inoperativeNodeData &&
                    state.inoperativeNodeData.length > 0
                      ? 'var(--FunctionalError-500)'
                      : ''
                }}
              >
                未生效应用节点
              </span>
              <Icon
                type="info-circle"
                style={{
                  color:
                    state.inoperativeNodeData &&
                    state.inoperativeNodeData.length > 0
                      ? 'var(--FunctionalError-500)'
                      : ''
                }}
              />
            </Fragment>
          }
        />
      </div>
      <Alert
        type="warning"
        message={
          <p style={{ color: '#646676' }}>
            即时生效。关闭后，探针将不区分压测流量，且无法采集监控日志。无法从平台发起压测流量的压测和调试。（仅对5.1.2.0以上版本探针生效，请升级后使用）
          </p>}
        showIcon
        style={{ marginTop: 10, marginBottom: 10 }}
      />
      <SwitchBar state={state} setState={setState} />
    </div>
  );
};
export default AgentSwitch;
