/**
 * @name
 * @author MingShined
 */
import { Alert } from 'antd';
import React from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import AgentSwitch from '../agentSwitch/indexPage';
import PressureMeasureSwitch from '../pressureMeasureSwitch/indexPage';
import WhitelistSwitch from '../whitelistSwitch/indexPage';
interface Props {}
const GlobalConfig: React.FC<Props> = props => {
  return (
    <BasePageLayout title="全局配置">
      <Alert
        type="warning"
        message={
          <p style={{ color: '#646676' }}>
            本次修改将对【当前环境的所有应用】生效，无须重启应用，请谨慎变更配置
          </p>}
        showIcon
      />
      <AgentSwitch />
      <PressureMeasureSwitch />
    </BasePageLayout>
  );
};
export default GlobalConfig;
