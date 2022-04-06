import React, { useState, useEffect, useCallback } from 'react';
import { TreeSelect, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import service from '../pressureTestReport/service';
import LegendSelect, {
  getSeryColorByNameOrIndex,
} from './components/LegendSelect';
import useListService from 'src/utils/useListService';
import moment from 'moment';

interface Props {
  location: {
    query: any;
  };
}

const TrendChart: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    ...props.location?.query,
  });
  const [echartRef, setEchartRef] = useState();
  const [chartData, setChartData] = useState({
    time: [],
    tps: [],
    list: [],
    // time: [
    //   '2022-03-11',
    //   '2022-03-12',
    //   '2022-03-13',
    //   '2022-03-14',
    //   '2022-03-15',
    // ],
    // tps: [100, 120, 130, 140, 150],
    // list: [
    //   {
    //     name: '192.168.1.11',
    //     requestFlow: [1, 2, 3, 4, 5],
    //     cpu: [20, 40, 30, 24, 15],
    //     ram: [200, 400, 100, 400, 250],
    //     disk: [30, 20, 25, 58, 100],
    //     network: [40, 400, 200, 300, 550],
    //   },
    //   {
    //     name: '192.168.1.33',
    //     requestFlow: [4, 2, 1, 6, 35],
    //     cpu: [30, 20, 10, 14, 25],
    //     ram: [400, 200, 11, 260, 350],
    //     disk: [20, 33, 41, 90, 300],
    //     network: [51, 41, 141, 231, 45],
    //   },
    //   {
    //     name: '192.168.1.1',
    //     requestFlow: [13, 2, 1, 6, 35],
    //     cpu: [30, 20, 10, 14, 25],
    //     ram: [400, 200, 11, 260, 350],
    //     disk: [20, 33, 41, 90, 300],
    //     network: [51, 41, 141, 231, 45],
    //   },
    //   {
    //     name: '192.168.1.2',
    //     requestFlow: [24, 2, 1, 6, 35],
    //     cpu: [30, 20, 10, 14, 25],
    //     ram: [400, 200, 11, 260, 350],
    //     disk: [20, 33, 41, 90, 300],
    //     network: [51, 41, 141, 231, 45],
    //   },
    //   {
    //     name: '192.168.1.3',
    //     requestFlow: [34, 2, 1, 6, 35],
    //     cpu: [30, 20, 10, 14, 25],
    //     ram: [400, 200, 11, 260, 350],
    //     disk: [20, 33, 41, 90, 300],
    //     network: [51, 41, 141, 231, 45],
    //   },
    // ],
  });

  const [seriesShowed, setSeriesShowed] = useState([]);

  // 应用列表
  const { list: appList } = useListService({
    service: service.getAllApplicationsWithSceneId,
    defaultQuery: {
      reportId: query.reportId,
      sceneId: query.sceneId,
      xpathMd5: query.xpathMd5,
    },
  });

  // 应用节点列表
  const { list: nodeList, getList: getNodeList } = useListService({
    service: service.getApplicationNodes,
    defaultQuery: {
      applicationName: query.applicationName,
    },
    isQueryOnMount: false,
    afterSearchCallback: (res) => {
      const nodes = res?.data?.data;
      setSeriesShowed(nodes);
      setQuery({
        ...query,
        nodes,
      });
    },
  });

  // 变更应用时重新获取节点列表
  useEffect(() => {
    getNodeList({
      applicationName: query.applicationName,
    });
  }, [query.applicationName]);

  const commonGrid = {
    left: '3%',
    height: 200,
    width: `43%`,
    show: true,
    borderColor: 'none',
  };

  const seriesConfig = [
    {
      name: '请求数',
      dataIndex: 'requestFlow',
      gridCfg: {
        top: 120,
      },
    },
    {
      name: 'CPU利用率',
      dataIndex: 'cpu',
      gridCfg: {
        top: 400,
      },
    },
    {
      name: '内存',
      dataIndex: 'ram',
      gridCfg: {
        top: 400,
        left: '53%',
      },
    },
    {
      name: '负载',
      dataIndex: 'cost',
      gridCfg: {
        top: 680,
      },
    },
    {
      name: '磁盘',
      dataIndex: 'disk',
      gridCfg: {
        top: 680,
        left: '53%',
      },
    },
    {
      name: '网络',
      dataIndex: 'network',
      gridCfg: {
        top: 960,
      },
    },
  ];

  const commonYaxisConfig = {
    type: 'value',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#98A1B3',
      width: 20,
      overflow: 'truncate',
      formatter: (val, index) => {
        return val > 9999 ? `${val / 10000}万` : val;
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: ['#E6EAF0', '#fff'],
      },
    },
  };

  const grid = [];
  const yAxis = [];
  const xAxis = [];
  const series = [];
  // const selectedLegend = {};

  seriesConfig.forEach((x, i) => {
    grid.push({
      ...commonGrid,
      ...x.gridCfg,
    });
    xAxis.push({
      type: 'category',
      boundaryGap: false,
      axisLine: {
        onZero: true,
        lineStyle: {
          color: '#00BCD4',
        },
      },
      // axisTick: {
      //   show: false,
      // },
      axisLabel: {
        color: '#98A1B3',
      },
      data: chartData.time,
      gridIndex: i,
    });
    yAxis.push(
      {
        gridIndex: i,
        name: x.name,
        nameTextStyle: {
          align: 'left',
        },
        ...commonYaxisConfig,
      },
      {
        name: 'TPS',
        gridIndex: i,
        ...commonYaxisConfig,
        nameTextStyle: {
          align: 'right',
        },
        splitLine: {
          ...commonYaxisConfig.splitLine,
          show: false,
        },
      }
    );
    series.push({
      type: 'line',
      showSymbol: true,
      hoverAnimation: false,
      smooth: true,
      // name: 'TPS',
      xAxisIndex: i,
      yAxisIndex: 2 * i + 1,
      data: chartData.tps,
      color: '#FE7D61',
      lineStyle: {
        type: 'dotted',
      },
    });
  });

  (chartData?.list || []).forEach((x) => {
    // 初始被选中legend的数目
    // if (Object.keys(selectedLegend).length < 2) {
    //   selectedLegend[x.name] = true;
    // } else {
    //   selectedLegend[x.name] = false;
    // }
    // 插入所有数据
    seriesConfig.forEach((y, i) => {
      series.push({
        type: 'line',
        showSymbol: true,
        hoverAnimation: false,
        smooth: true,
        name: x.name, // 公用同一个名字的线被划分在一个legend里
        id: `${x.name}-${y.name}-${i}`,
        xAxisIndex: i,
        yAxisIndex: 2 * i,
        data: x[y.dataIndex] || [],
        color: getSeryColorByNameOrIndex({
          list: chartData.list,
          name: x.name,
        }),
      });
    });
  });

  const getChartData = async (params = {}) => {
    setLoading(true);
    const {
      data: { success, data },
    } = await service
      .getTendencyChart({
        ...query,
        ...params,
      })
      .finally(() => {
        setLoading(false);
      });
    if (success) {
      setChartData(data);
    }
  };

  useEffect(() => {
    if (props.location.query?.endTime) {
      const timer = setInterval;
    }
  }, []);

  useEffect(() => {
    if (query?.nodes?.length > 0) {
      if (!props.location.query?.endTime) {
        // 实况
        const timer = setInterval(() => {
          getChartData({
            endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          });
        }, 5000);
        return () => clearInterval(timer);
      }
      // 报告
      getChartData();
    }
  }, [JSON.stringify(query)]);

  return (
    <Spin spinning={loading}>
      <div style={{ background: 'var(--Netural-100, #EEF0F2)', padding: 40 }}>
        <div
          style={{
            background: '#fff',
            padding: 40,
            borderRadius: 8,
            boxShadow:
              '0px 2px 10px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <TreeSelect
            showSearch
            style={{ width: 200 }}
            searchPlaceholder="搜索应用"
            value={query?.applicationName}
            treeData={appList.map((x) => ({
              title: x,
              value: x,
            }))}
            onChange={(val) =>
              setQuery({
                ...query,
                applicationName: val,
              })
            }
            dropdownStyle={{
              maxHeight: 200,
            }}
          />
          <div style={{ position: 'relative' }}>
            <LegendSelect
              style={{
                marginTop: 16,
              }}
              label="应用节点"
              allSeries={nodeList.map((x) => ({ name: x }))}
              echartRef={echartRef}
              seriesShowed={seriesShowed}
              onChangeShowedSeries={setSeriesShowed}
            />
            <ReactEcharts
              ref={useCallback((echarts) => setEchartRef(echarts), [])}
              style={{ width: '100%', height: 1210 }}
              option={{
                grid,
                xAxis,
                yAxis,
                series,
                backgroundColor: '#fff',
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    animation: false,
                  },
                  formatter: (val) => {
                    let str = `${val[0]?.axisValue} <br>`;
                    let mutiSeriAdded = false;
                    val.forEach((x) => {
                      const isTps = x.seriesName.startsWith('series');
                      if (!isTps) {
                        const typeName = x.seriesId.split('-')?.[1];
                        str += `${x.marker} ${x.seriesName} ${typeName}: ${x.value}<br>`;
                      }
                      if (isTps && !mutiSeriAdded) {
                        str += `${x.marker} TPS ${x.value}<br>`;
                        mutiSeriAdded = true;
                      }
                      if (isTps && val.length > grid.length) {
                        str += '<hr style="opacity: 0.4">';
                      }
                    });
                    return str;
                  },
                },
                dataZoom: [
                  {
                    show: true,
                    type: 'slider',
                    top: 20,
                    left: 100,
                    right: 100,
                    realtime: true,
                    start: 0,
                    end: 100,
                    xAxisIndex: grid.map((x, i) => i),

                    // bottom: 1080,
                    // backgroundColor: '#EEF0F2',
                    // borderColor: 'transparent',
                    // fillerColor: '#3976E8',
                    // dataBackground: {
                    //   lineStyle: {
                    //     color: 'transparent',
                    //   },
                    //   areaStyle: {
                    //     color: 'transparent',
                    //   },
                    // },
                    // handleIcon: 'path://M25,50 a 25,25 0 1,1 50,0 a 25,25 0 1,1 -50,0',
                    // handleStyle: {
                    //   color: '#fff',
                    //   borderColor: '#3976E8',
                    // },
                  },
                ],
                axisPointer: {
                  link: { xAxisIndex: 'all' },
                },
                legend: {
                  show: false,
                  // type: 'scroll',
                  // top: 50,
                  // icon: 'path://M0,0 L0,10 L10,10 L10,0 z',
                  // selected: selectedLegend,
                },
              }}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default TrendChart;
