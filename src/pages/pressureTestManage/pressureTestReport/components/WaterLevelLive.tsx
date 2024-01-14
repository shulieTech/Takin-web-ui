/* eslint-disable react-hooks/exhaustive-deps */
import { Badge, Button, Col, Collapse, Icon, Input, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import { router } from 'umi';
import PressureTestReportService from '../service';
import styles from './../index.less';
import MachinePerformanceCharts from './MachinePerformanceCharts';
interface Props {
  id?: string;
  isReload?: boolean;
}

interface State {
  data: any[];
  searchValue: string;
  ipKey: number;
  ipValue: string;
  waterLeveAppMachineList: any[];
  detailData: any;
  loading: boolean;
  applicationName: string;
  current: number;
  processName: string;
}
const WaterLevelLive: React.FC<Props> = props => {
  const { Panel } = Collapse;
  const { id } = props;
  const [state, setState] = useStateReducer<State>({
    data: null,
    searchValue: null,
    ipKey: 0,
    ipValue: '0',
    waterLeveAppMachineList: null,
    detailData: null,
    loading: false,
    applicationName: null,
    current: 0,
    processName: ''
  });

  const { waterLeveAppMachineList, detailData } = state;

  useEffect(() => {
    queryWaterLevelList({ reportId: id, applicationName: state.searchValue });
  }, [state.searchValue, props.isReload]);

  useEffect(() => {
    queryMachinePerformanceDetail();
  }, [state.searchValue, props.isReload, state.ipValue, state.applicationName]);

  /**
   * @name 获取压测明细列表
   */
  const queryWaterLevelList = async value => {
    const {
      data: { success, data }
    } = await PressureTestReportService.queryWaterLevelList({
      ...value
    });
    if (success) {
      setState({
        data
      });
    }
  };

  /**
   * @name 获取容量水位应用机器列表
   */
  const queryWaterLeveAppMachineList = async value => {
    const {
      data: { success, data }
    } = await PressureTestReportService.queryWaterLeveAppMachineList({
      ...value
    });
    if (success) {
      if (state.waterLeveAppMachineList) {
        setState({
          waterLeveAppMachineList: state.waterLeveAppMachineList.concat(data)
        });
      } else {
        setState({
          waterLeveAppMachineList: [
            { machineIp: '全部', riskFlag: false }
          ].concat(data)
        });
      }
    }
  };

  /**
   * @name 获取风险机器性能详情
   */
  const queryMachinePerformanceDetail = async () => {
    const {
      data: { success, data }
    } = await PressureTestReportService.queryMachinePerformanceDetail({
      reportId: id,
      applicationName: state.applicationName,
      machineIp: state.ipValue
    });
    if (success) {
      setState({
        detailData: data
      });
    }
  };

  const handlesearch = async e => {
    setState({
      searchValue: e.target.value
    });
  };

  const handleChangeIp = (key, value, processName) => {
    setState({
      processName,
      ipKey: key,
      ipValue: value
    });
  };

  const queryWaterLevelDetail = async key => {
    setState({
      ipKey: 0,
      ipValue: '0',
      applicationName: key,
      current: 0,
      waterLeveAppMachineList: null
    });

    const {
      data: { success, data }
    } = await PressureTestReportService.queryWaterLeveAppMachineList({
      reportId: id,
      applicationName: key,
      current: 0,
      pageSize: 20
    });
    if (success) {
      setState({
        waterLeveAppMachineList: [
          { machineIp: '全部', riskFlag: false }
        ].concat(data)
      });
    }
    setState({ applicationName: key, ipValue: '全部' });
  };

  const handleScroll = e => {
    if (
      e.target.scrollHeight - e.target.scrollTop === 600 &&
      e.target.scrollTop !== 0
    ) {
      setState({
        current: state.current + 1
      });

      queryWaterLeveAppMachineList({
        reportId: id,
        applicationName: state.applicationName,
        current: state.current + 1,
        pageSize: 20
      });
    }
  };

  return (
    <Fragment>
      <Input
        prefix={<Icon type="search" />}
        style={{ width: 230, marginBottom: 16 }}
        placeholder="应用"
        onPressEnter={handlesearch}
      />
      <div className={styles.waterLevelWrap}>
        <Collapse
          accordion
          expandIconPosition="right"
          onChange={key => queryWaterLevelDetail(key)}
        >
          {state.data && state.data.length > 0 ? (
            state.data.map((item, key) => {
              return (
                <Panel
                  header={
                    <Row type="flex">
                      <Col className={styles.waterLevelValue} span={12}>
                        {item.applicationName}
                      </Col>
                      <Col span={4}>
                        <span className={styles.waterLevelLabel}>
                          风险机器：
                        </span>
                        <span
                          className={styles.waterLevelValue}
                          style={{ fontSize: '14px' }}
                        >
                          {item.riskCount}台
                        </span>
                      </Col>
                      <Col span={4}>
                        <span className={styles.waterLevelLabel}>
                          机器总台数：
                        </span>
                        <span
                          className={styles.waterLevelValue}
                          style={{ fontSize: '14px' }}
                        >
                          {item.totalCount}台
                        </span>
                      </Col>
                      <Col span={4} style={{ textAlign: 'right' }}>
                        <Button type="link">水位详情</Button>
                      </Col>
                    </Row>
                  }
                  key={item.applicationName}
                >
                  <div style={{ display: 'flex' }}>
                    <div
                      id="leftWrap"
                      className={styles.leftSelected}
                      style={{ height: 602 }}
                      onScroll={e => handleScroll(e)}
                    >
                      {waterLeveAppMachineList &&
                        waterLeveAppMachineList.map((item2, key2) => {
                          return (
                            <p
                              key={key2}
                              className={
                                state.ipKey === key2
                                  ? styles.appItemActive
                                  : styles.appItem
                              }
                              onClick={() =>
                                handleChangeIp(
                                  key2,
                                  item2.machineIp,
                                  item2.processName
                                )
                              }
                            >
                              <Badge
                                color={item2.riskFlag ? '#FE7D61' : '#D0D1D4'}
                                text={item2.machineIp}
                              />
                            </p>
                          );
                        })}
                    </div>
                    <div className={styles.riskMachineList}>
                      <div className="ft-rt">
                        {state.processName ? (
                          <Button
                            type="primary"
                            onClick={() =>
                              router.push(
                                // tslint:disable-next-line: max-line-length
                                `/analysisManage?reportId=${id}&appName=${item.applicationName}&processName=${state.processName}&type=actually`
                              )
                            }
                          >
                            深度分析
                          </Button>
                        ) : null}
                      </div>
                      <MachinePerformanceCharts
                        chartsInfo={
                          detailData && detailData.tpsTarget
                            ? detailData.tpsTarget
                            : []
                        }
                      />
                    </div>
                  </div>
                </Panel>
              );
            })
          ) : (
            <div>暂无数据</div>
          )}
        </Collapse>
      </div>
    </Fragment>
  );
};
export default WaterLevelLive;
