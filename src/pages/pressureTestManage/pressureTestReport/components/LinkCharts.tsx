import { InputNumber, message } from 'antd';
import { CommonModal } from 'racc';
import React, { useState, useEffect, ReactNode } from 'react';
import { TestMode } from '../../pressureTestScene/enum';
import PressureTestReportService from '../service';
import styles from './../index.less';
import LineCharts from './LineCharts';
// import GraphNode from 'src/components/g6-graph/GraphNode';
import BusinessActivityTree from './BusinessActivityTree';

interface Props {
  tabList?: any[];
  chartsInfo?: any;
  state?: any;
  setState?: (value) => void;
  isLive?: boolean;
  graphConfig?: {
    tooltip?: string | ReactNode;
    defaultLabelSetting?: string[];
    freezedDrag?: boolean;
    freezeExpand?: boolean; // 禁用折叠/展开操作 且一开始全部展开
    freezeLabelSetting?: boolean; // 禁用labelSetting, 一开始全部展示
  };
  chartConfig?: {
    tooltip?: string | ReactNode;
  };
}
const LinkCharts: React.FC<Props> = (props) => {
  const { chartsInfo, setState, state, tabList } = props;
  const [targetTps, setTargetTps] = useState<number>(undefined);

  // 旧版的压测模式pressureType在detailData里，新版的混合场景压测在tree的节点数据里
  const isOldVersionTpsTest =
    state.detailData.pressureType === TestMode.TPS模式;
  const isMutiTpsTest =
    state.selectedTreeNode?.pressureType === TestMode.TPS模式;
  const xpathMd5ForOldTpsTest = 'all';

  const handleChangeTab = (value, e) => {
    if (value) {
      setState({
        tabKey: value,
        selectedTreeNode: e?.node?.props?.dataRef,
      });
    }
  };
  const getDefaultValue = async () => {
    const {
      data: { data, success },
    } = await PressureTestReportService.getTpsValue({
      reportId: state.detailData.id,
      sceneId: state.detailData.sceneId,
      xpathMd5: isOldVersionTpsTest
        ? xpathMd5ForOldTpsTest
        : state.selectedTreeNode?.xpathMd5, // 旧版tps模式xpathMd5是个固定值
    });
    if (success) {
      setTargetTps(data);
    }
  };
  const adjustTps = () => {
    if (!targetTps) {
      message.info('请填写TPS');
      return;
    }
    return new Promise(async (resolve) => {
      const {
        data: { success },
      } = await PressureTestReportService.adjustTPS({
        targetTps,
        reportId: state.detailData.id,
        sceneId: state.detailData.sceneId,
        xpathMd5: isOldVersionTpsTest
          ? xpathMd5ForOldTpsTest
          : state.selectedTreeNode?.xpathMd5, // 旧版tps模式xpathMd5是个固定值
      });
      if (success) {
        message.success('调整成功');
        resolve(true);
      }
      resolve(false);
    });
  };

  useEffect(() => {
    if (isOldVersionTpsTest || isMutiTpsTest) {
      getDefaultValue();
    }
  }, [state.selectedTreeNode?.xpathMd5]);

  return (
    <div
      style={{
        display: 'flex',
        marginTop: 16,
      }}
    >
      <div className={styles.leftSelected}>
        <BusinessActivityTree
          tabList={state.tabList}
          defaultSelectedKey={state.tabKey}
          onChange={handleChangeTab}
        />
      </div>
      <div className={styles.riskMachineList} style={{ position: 'relative' }}>
        {props.isLive && (isOldVersionTpsTest || isMutiTpsTest) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              paddingBottom: 10,
            }}
          >
            <CommonModal
              modalProps={{
                okText: '确定',
                cancelText: '取消',
                title: '调整TPS',
                destroyOnClose: true,
              }}
              btnText="调整TPS"
              btnProps={{ ghost: true }}
              beforeOk={adjustTps}
            >
              TPS：
              <InputNumber
                value={targetTps}
                onChange={(value) => setTargetTps(value)}
                precision={0}
                min={0}
              />
            </CommonModal>
          </div>
        )}
        <LineCharts
          // columnNum={state.tabKey === 0 ? 2 : 1}
          columnNum={2}
          isLive={props.isLive}
          chartsInfo={chartsInfo}
          {...props.chartConfig}
        />
      </div>
    </div>
  );
};
export default LinkCharts;
