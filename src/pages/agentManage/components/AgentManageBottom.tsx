/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import CustomAlert from 'src/common/custom-alert/CustomAlert';
import styles from './../index.less';
import customStyles from './../../../custom.less';
import { AgentManageContext } from '../indexPage';
import AgentManageService from '../service';
import AgentManageSearchAndTable from './AgentManageSearchAndTable';
interface Props {}

const AgentManageBottom: React.FC<Props> = props => {
  const { state, setState } = useContext(AgentManageContext);
  const { agentDashboard } = state;

  useEffect(() => {
    queryAgentDashboard();
  }, []);

  /**
   * @name 获取探针概况
   */
  const queryAgentDashboard = async () => {
    const {
      data: { success, data }
    } = await AgentManageService.queryAgentDashboard({});
    if (success) {
      setState({
        agentDashboard: data
      });
    }
  };

  const alertData = [
    {
      label: 'Agent安装总数',
      value: agentDashboard.agentCount,
      color: customStyles.alertValueNormal
    },

    {
      label: 'Agent安装失败',
      value: agentDashboard.agentFailCount,
      color:
        agentDashboard.agentFailCount > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    },
    {
      label: '探针安装总数',
      value: agentDashboard.probeCount,
      color: customStyles.alertValueNormal
    },
    {
      label: '探针安装失败',
      value: agentDashboard.probeFailCount,
      color:
        agentDashboard.probeFailCount > 0
          ? customStyles.alertValueError
          : customStyles.alertValueNormal
    }
  ];
  return (
    <div
      className={styles.borders}
      style={{
        marginTop: 16,
        height: 'calc(100% - 112px)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {agentDashboard.totalNum !== null && (
        <CustomAlert
          message
          showIcon
          types={
            agentDashboard.agentFailCount > 0 ||
            agentDashboard.probeFailCount > 0
              ? 'error'
              : 'info'
          }
          title="探针概况"
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
      )}
      <div
        style={{
          height: 'calc(100% - 35px)',
          position: 'relative',
          overflow: 'scroll'
        }}
      >
        <AgentManageSearchAndTable />
      </div>
    </div>
  );
};
export default AgentManageBottom;
