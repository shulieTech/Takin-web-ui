/**
 * @name
 * @author MingShined
 */
// 卡慢1 接口异常2 巡检异常3 
import { ColumnProps } from 'antd/lib/table';
import {
  Table, Row, Col, Form, Descriptions,
  Card, Progress, Statistic, Button, Tabs, Spin
} from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import ReactEcharts from 'echarts-for-react';
import MissionManageService from '../service';
import moment from 'moment';
import styles from '../index.less';
const { TabPane } = Tabs;
interface Props extends CommonModelState {
  btnText: string;
  onSuccess: () => void;
  location: any;
}
const indexPage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    dataSource: [],
    total: 0,
    details: {
      successRate: '',
      businessErrorCount: '',
      businessCount: '',
      e2eCount: '',
      rt: 0,
      e2eErrorCount: '',
    },
    exceptionConfig: {
      valueType1Level1: 0,
      valueType1Level2: 0,
      valueType2Level1: 0,
      valueType2Level2: 0
    },
    checkpointData: {
      items: []
    },
    metrics: {
      items: []
    },
    count: [],
    tabsdetial: [],
    topology: {},
    divLoading: true,
    cardLoading: true,
    tableLoading: true,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    type: 0,
    dataTypeTree: []
  });

  useEffect(() => {
    queryTable();
  }, []);

  const { location } = props;

  const queryTable = async () => {
    if (location.query.exceptionId) {
      const {
        data: { data, success }
      } = await MissionManageService.exceptionDetail({ exceptionId: location.query.exceptionId });
      if (success) {
        setState({ tabsdetial: data, divLoading: false });
        topology(data[0].activityId, data[0]);
        statistics(data[0]);
      }
    } else {
      const {
        data: { data, success }
      } = await MissionManageService.exceptionDetail({ chainId: location.query.chainId });
      if (success) {
        setState({ tabsdetial: data, divLoading: false });
        topology(data[0].activityId, data[0]);
        statistics(data[0]);
      }
    }
  };

  const topology = async (activityId, datas) => {
    setState({ type: datas.type });
    if (datas.type === 0) {
      const {
        data: { data, success }
      } = await MissionManageService.topology({ activityId });
      if (success) {
        setState({ topology: data });
        if (datas.exceptionType === 2) {
          const dataList = await MissionManageService.checkpoint({ linkTopologyDTO: { ...data }, ...datas });
          if (dataList.data.success) {
            setState({ checkpointData: dataList.data.data, tableLoading: false });
          }
        } else if (datas.exceptionType === 1) {
          const dataList = await MissionManageService.metrics({ linkTopologyDTO: { ...data }, ...datas });
          if (dataList.data.success) {
            setState({ metrics: dataList.data.data, tableLoading: false });
          }
        }
      }
    } else {
      const data = {
        edges: [
          {
            appName: datas.application,
            method: datas.method,
            rpcType: datas.rpcType,
            service: datas.serviceName,
            entranceName: '-'
          }
        ],
        nodes: []
      };
      if (datas.exceptionType === 2) {
        const dataList = await MissionManageService.checkpoint({ linkTopologyDTO: { ...data }, ...datas });
        if (dataList.data.success) {
          setState({ checkpointData: dataList.data.data, tableLoading: false });
        }
      } else if (datas.exceptionType === 1) {
        const dataList = await MissionManageService.metrics({ linkTopologyDTO: { ...data }, ...datas });
        if (dataList.data.success) {
          setState({ metrics: dataList.data.data, tableLoading: false });
        }
      }
    }
  };

  const statistics = async value => {
    const {
      data: { data, success }
    } = await MissionManageService.statistics({ ...value });
    if (success) {
      const datas =
        data &&
        data.items &&
        data.items.map((ite, ind) => {
          ite.name = ite.name;
          ite.value = ite.value;
          return ite;
        });
      setState({
        details: data,
        exceptionConfig: data.exceptionConfig,
        count: datas,
        cardLoading: false,
        dataTypeTree: data.exceptionDetails,
        tableLoading: false
      });
    }
  };

  const sortArr = arr => {
    if (arr) {
      arr.sort((a, b) => {
        return b.rt - a.rt;
      });
      arr.map((ite, index) => {
        ite.key = index + 1;
        return ite;
      });
    }
    return arr;
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        title: '技术检查点（断言）',
        dataIndex: 'name',
      },
      {
        title: '服务',
        dataIndex: 'service',
        ellipsis: true,
      },
      {
        title: '应用',
        dataIndex: 'application',
        ellipsis: true,
      },
      {
        title: '上游应用',
        dataIndex: 'parentApplications',
        render: text => text.join(','),
        ellipsis: true,
      },
      {
        title: '占比',
        dataIndex: 'percentage',
        render: text => `${text.toFixed(2)}%`
      }
    ];
  };

  const getColumnTree = (): ColumnProps<any>[] => {
    return [
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '详情',
        dataIndex: 'msg',
        ellipsis: true,
      },
    ];
  };

  const getColumn = (): ColumnProps<any>[] => {
    return [
      {
        title: '排名',
        dataIndex: 'key',
        width: 100
      },
      {
        title: '服务',
        dataIndex: 'service',
        ellipsis: true,
      },
      {
        title: '应用',
        dataIndex: 'application',
        ellipsis: true,
      },
      {
        title: '上游应用',
        dataIndex: 'parentApplications',
        render: text => text.join(','),
        ellipsis: true,
      },
      {
        title: 'RT',
        dataIndex: 'rt',
        render: text => `${text.toFixed(2)}ms`,
        width: 200
      }
    ];
  };

  const calcTimeDiff = (startTime, endTime) => {
    const diff = moment.duration(moment(endTime).diff(moment(startTime)));
    const tempData = [
      { key: 'years', value: 0, desc: 'year' },
      { key: 'months', value: 0, desc: 'mouth' },
      { key: 'days', value: 0, desc: 'day' },
      { key: 'hours', value: 0, desc: 'h' },
      { key: 'minutes', value: 0, desc: '\'' },
      { key: 'seconds', value: 0, desc: '\'\'' }
      // { key: 'milliseconds', value: 0, desc: 'ms' },
    ];
    tempData.forEach(t => {
      if (diff._data[t.key]) {
        t.value = diff._data[t.key];
      }
    });
    let firstIndex = tempData.findIndex(t => t.value);
    const outCount = 3;
    const minOut = tempData.length - 3;
    firstIndex = firstIndex > minOut ? minOut : firstIndex;
    let out = '';
    for (let i = 0; i < outCount; i += 1) {
      const item = tempData[firstIndex + i];
      out += item.value + item.desc;
    }
    return out;
  };

  const formatPercent = percent => {
    if (percent === 100) {
      return <span style={{ fontSize: '22px', color: 'var(--FunctionalError-500)' }}>{percent}%</span>;
    }
    if (percent && percent.toString().indexOf('.') !== -1) {
      return `${percent.toFixed(2)}%`;
    }
    return `${percent}%`;
  };

  const callback = key => {
    setState({ tableLoading: true, cardLoading: true });
    topology(JSON.parse(key).activityId, JSON.parse(key));
    statistics(JSON.parse(key));
  };

  const { tabsdetial, details, checkpointData, metrics, exceptionConfig } = state;
  const num1 =
    (Number(details && details.businessErrorCount) /
      Number(details && details.businessCount)) *
    100;
  const num2 =
    (Number(details && details.e2eErrorCount) /
      Number(details && details.e2eCount)) *
    100;
  // tslint:disable-next-line:jsx-wrap-multiline
  const operations = <Button
    style={{ marginRight: 15 }}
    // tslint:disable-next-line:jsx-alignment
    onClick={() => window.history.back(-1)}>返回</Button>;

  return (
    <div>
      {
        state.divLoading ?
          <center style={{ marginTop: 250 }}> <Spin size="large" /></center>
          : (
            <Tabs onChange={callback} tabBarExtraContent={operations}>
              {tabsdetial.map(pane => (
                <TabPane
                  tab={{ 1: '卡慢', 2: '接口异常', 3: '巡检异常', }[pane.exceptionType]}
                  key={JSON.stringify(pane)}
                >
                  <div className={styles.font}>
                    <Descriptions title={`${pane.name}(${{ 0: '业务', 1: '技术' }[pane.type]})`} column={3}>
                      <Descriptions.Item label="瓶颈类型">
                        {{ 0: '全部', 1: '卡慢', 2: '接口异常', 3: '巡检异常' }[pane.exceptionType]}
                      </Descriptions.Item>
                      <Descriptions.Item label="瓶颈程度">
                        {pane.exceptionLevel === 1 ? '一般' : '严重'}
                      </Descriptions.Item>
                      <Descriptions.Item label="业务活动入口">{pane.entranceName}</Descriptions.Item>
                      <Descriptions.Item label="所属应用">{pane.application}</Descriptions.Item>
                      <Descriptions.Item label="持续时间">{calcTimeDiff(pane.startTime, pane.endTime)}</Descriptions.Item>
                      <Descriptions.Item label="瓶颈开始时间">
                        {moment(pane.startTime).format('YYYY-MM-DD HH:mm:ss')}
                      </Descriptions.Item>
                    </Descriptions>
                    <Row style={{ display: pane.exceptionType === 2 ? 'block' : 'none' }}>
                      <Col span={state.type === 0 ? 15 : 24}>
                        <Card style={{ height: '370px' }} loading={state.cardLoading}>
                          <h3>请求概览</h3>
                          <Row style={{ marginTop: 35 }}>
                            <Col span={8}>
                              <Statistic title="业务总请求" value={details && details.businessCount} />
                              <p style={{ margin: '20px 0', fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>
                                业务请求错误率
                              </p>
                              <Progress
                                type="circle"
                                percent={num1}
                                strokeColor="red"
                                format={percent => formatPercent(percent)}
                              />
                            </Col>
                            <Col span={8}>
                              <Statistic title="巡检总请求" value={details && details.e2eCount} />
                              <p style={{ margin: '20px 0', fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)' }}>
                                巡检请求错误率
                              </p>
                              <Progress
                                type="circle"
                                percent={num2}
                                strokeColor="red"
                                format={percent => formatPercent(percent)}
                              />
                            </Col>
                            <Col span={8}>
                              <Statistic
                                title="当前成功率"
                                value={details && details.successRate}
                                suffix="%"
                                formatter={percent => `${(Number(percent) * 100).toFixed(2)}`}
                              />
                              <Descriptions column={1} style={{ marginTop: 20 }}>
                                <Descriptions.Item label={`${pane.exceptionLevel === 1 ? '一般' : '严重'}瓶颈基线`}>
                                  {exceptionConfig[`valueType${pane.exceptionType}Level${pane.exceptionLevel}`]}%
                      </Descriptions.Item>
                              </Descriptions>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                      <Col span={8} offset={1} style={{ display: state.type === 1 ? 'none' : 'block' }}>
                        <Card style={{ height: '370px' }} loading={state.cardLoading}>
                          <h3>业务检查点分布</h3>
                          <ReactEcharts
                            option={{
                              color: ['#5470c6'
                                , '#91cc75'
                                , ' #fac858'
                                , '#ee6666'
                                , '#73c0de'
                                , '#3ba272'
                                , '#fc8452'
                                , ' #9a60b4'
                                , '#ea7ccc'],
                              tooltip: {
                                trigger: 'item'
                              },
                              legend: {
                                orient: 'vertical',
                                right: 'right',
                              },
                              series: [
                                {
                                  type: 'pie',
                                  top: '-50px',
                                  left: '-80px',
                                  radius: ['30%', '60%'],
                                  avoidLabelOverlap: false,
                                  label: {
                                    show: false,
                                    position: 'center'
                                  },
                                  emphasis: {
                                    label: {
                                      show: true,
                                      fontSize: '20',
                                      fontWeight: 'bold'
                                    }
                                  },
                                  labelLine: {
                                    show: false
                                  },
                                  data: state.count
                                }
                              ]
                            }}
                          />
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ display: pane.exceptionType === 1 ? 'block' : 'none' }}>
                      <Col span={24}>
                        <Card style={{ height: '300px' }} loading={state.cardLoading}>
                          <h3>请求概览</h3>
                          <Row style={{ marginTop: 55 }}>
                            <Col span={7} offset={1}>
                              <Statistic title="业务总请求" value={details && details.businessCount} />
                            </Col>
                            <Col span={7} offset={1}>
                              <Statistic title="巡检总请求" value={details && details.e2eCount} />
                            </Col>
                            <Col span={8}>
                              <Descriptions column={1} style={{ marginTop: 20 }}>
                                <Descriptions.Item label="当前RT">{details.rt && details.rt.toFixed(2)}
                              ms
                              </Descriptions.Item>
                                <Descriptions.Item label={`${pane.exceptionLevel === 1 ? '一般' : '严重'}基线`}>
                                  {exceptionConfig[`valueType${pane.exceptionType}Level${pane.exceptionLevel}`]}ms
                    </Descriptions.Item>
                              </Descriptions>
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    </Row>
                    <Card style={{ display: pane.exceptionType === 2 ? 'block' : 'none', marginTop: 20 }}>
                      <Table
                        columns={getColumns()}
                        dataSource={checkpointData && checkpointData.items}
                        style={{ background: 'none' }}
                        pagination={{ pageSize: 10 }}
                        loading={state.tableLoading}
                      />
                    </Card>
                    <Card style={{ display: pane.exceptionType === 3 ? 'block' : 'none', marginTop: 20 }}>
                      <Table
                        columns={getColumnTree()}
                        dataSource={state.dataTypeTree}
                        style={{ background: 'none' }}
                        pagination={{ pageSize: 10 }}
                        loading={state.tableLoading}
                      />
                    </Card>
                    <Card style={{ display: pane.exceptionType === 1 ? 'block' : 'none', marginTop: 20 }}>
                      <Table
                        columns={getColumn()}
                        dataSource={sortArr(metrics && metrics.items)}
                        style={{ background: 'none' }}
                        pagination={{ pageSize: 10 }}
                        loading={state.tableLoading}
                      />
                    </Card>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          )
      }
    </div>
  );
};

export default Form.create()(indexPage);
