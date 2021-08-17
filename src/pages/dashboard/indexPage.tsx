/**
 * @name
 * @author chuxu
 */
import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import { BasePageLayout } from 'src/components/page-layout';
import { Row, Col } from 'antd';
import PressureTestSwitch from './components/PressureTestSwitch';
import FlowBalance from './components/FlowBalance';
import Blank from './components/Blank';
import QuickEntry from './components/QuickEntry';
import AppAndFlow from './components/AppAndFlow';
import PressureScene from './components/PressureScene';
import PressureResult from './components/PressureResult';
import AppManageService from '../appManage/service';
import { useStateReducer } from 'racc';
import IndexService from './service';
import { getTakinAuthority } from 'src/utils/utils';
interface Props {}
interface State {
  switchStatus: any;
  flowAccountData: any;
  quickEntranceData: any;
  pressureTestSceneList: any;
  pressureTestReportList: any;
  appAndSystemFlowData: any;
}

const DashboardPage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    switchStatus: null,
    flowAccountData: null,
    quickEntranceData: null,
    pressureTestSceneList: null,
    pressureTestReportList: null,
    appAndSystemFlowData: null
  });

  const {
    switchStatus,
    flowAccountData,
    quickEntranceData,
    pressureTestSceneList,
    pressureTestReportList,
    appAndSystemFlowData
  } = state;

  useEffect(() => {
    querySwitchStatus();
    if (getTakinAuthority() === 'true') {
      queryFlowAccountInfo();
    }

    queryQucikEnterance();
    queryPressureTestSceneList();
    queryPressureTestReportList();
    queryAppAndSystemFlow();
  }, []);
  /**
   * @name 获取压测开关状态
   */
  const querySwitchStatus = async () => {
    const {
      data: { data, success }
    } = await AppManageService.querySwitchStatus({});
    if (success) {
      setState({
        switchStatus: data.switchStatus
      });
    }
  };

  /**
   * @name 获取流量账户信息
   */
  const queryFlowAccountInfo = async () => {
    const {
      total,
      data: { success, data }
    } = await IndexService.queryFlowAccountInfoDic({});
    if (success) {
      setState({
        flowAccountData: data
      });
    }
  };

  /**
   * @name 获取快捷入口数据
   */
  const queryQucikEnterance = async () => {
    const {
      total,
      data: { success, data }
    } = await IndexService.queryQuickEntrance({});
    if (success) {
      setState({
        quickEntranceData: data
      });
    }
  };

  /**
   * @name 获取压测场景列表
   */
  const queryPressureTestSceneList = async () => {
    const {
      total,
      data: { success, data }
    } = await IndexService.queryPressureTestSceneList({
      pageSize: 3,
      current: 0,
      status: 5
    });
    if (success) {
      setState({
        pressureTestSceneList: data
      });
    }
  };

  /**
   * @name 获取压测报告列表
   */
  const queryPressureTestReportList = async () => {
    const {
      total,
      data: { success, data }
    } = await IndexService.queryPressureTestReportList({
      pageSize: 3,
      current: 0
    });
    if (success) {
      setState({
        pressureTestReportList: data
      });
    }
  };

  /**
   * @name 获取应用和系统流程
   */
  const queryAppAndSystemFlow = async () => {
    const {
      total,
      data: { success, data }
    } = await IndexService.queryAppAndSystemFlow({});
    if (success) {
      setState({
        appAndSystemFlowData: data
      });
    }
  };

  return (
    <BasePageLayout title="工作台">
      <Row type="flex">
        <Col span={6}>
          <PressureTestSwitch data={switchStatus} />
          {getTakinAuthority() === 'true' && <Blank />}
          {getTakinAuthority() === 'true' && (
            <FlowBalance data={flowAccountData} />
          )}
          <Blank />
          <QuickEntry data={quickEntranceData} />
        </Col>
        <Col span={18}>
          <AppAndFlow data={appAndSystemFlowData} />
          <Blank />
          <PressureScene data={pressureTestSceneList} />
          <Blank />
          <PressureResult data={pressureTestReportList} />
        </Col>
      </Row>
    </BasePageLayout>
  );
};
export default DashboardPage;
