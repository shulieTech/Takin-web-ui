/**
 * @name
 * @author MingShined
 */
import React from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import PressureMeasureSwitch from '../pressureMeasureSwitch/indexPage';
import WhitelistSwitch from '../whitelistSwitch/indexPage';
interface Props {}
const GlobalConfig: React.FC<Props> = props => {
  return (
    <BasePageLayout title="全局配置">
      <WhitelistSwitch />
      <PressureMeasureSwitch />
      {/* <DumpMemery /> */}
    </BasePageLayout>
  );
};
export default GlobalConfig;
