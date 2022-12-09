import ReactEcharts from 'echarts-for-react';
import React, { ReactNode } from 'react';
import { Tooltip, Icon, Row, Col } from 'antd';

interface Props {
  chartsInfo: any;
  chartsThreadInfo: any;
  isLive?: boolean;
  onEvents?: any;
  columnNum?: number;
  tooltip?: string | ReactNode;
}
const LineCharts: React.FC<Props> = (props) => {
  const { chartsInfo, onEvents, columnNum = 1, tooltip, chartsThreadInfo} = props;

  const grid = [];

  const seriesConfig = [
    {
      name: '请求成功率',
      dataIndex: 'successRate',
    },
    {
      name: '平均RT',
      dataIndex: 'rt',
    },
    {
      name: 'TPS',
      dataIndex: 'tps',
    },
    {
      name: 'SA',
      dataIndex: 'sa',
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

  const getAreaLinearConfig = (color = '#00CBBF') => ({
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            color,
            offset: 0,
          },
          {
            offset: 1,
            color: '#fff',
          },
        ],
      },
    },
  });

  const commonSeriyConfig = {
    type: 'line',
    showSymbol: true,
    hoverAnimation: false,
    smooth: true,
  };

  const xAxis = seriesConfig.map((x, i) => ({
    type: 'category',
    boundaryGap: false,
    axisLine: {
      onZero: true,
      lineStyle: {
        color: '#00BCD4',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#98A1B3',
    },
    data: chartsInfo.time,
    gridIndex: i,
  }));

  const yAxis = seriesConfig.map((x, i) => ({
    gridIndex: i,
    name: x.name,
    ...commonYaxisConfig,
  }));

  const series = seriesConfig.map((x, i) => ({
    ...commonSeriyConfig,
    name: x.name,
    xAxisIndex: i,
    yAxisIndex: i,
    data: chartsInfo[x.dataIndex],
    color: undefined,
    // ...getAreaLinearConfig(),
  }));

  // 4个图分别添加重复数据
  for (let i = 0; i < 4; i += 1) {
    const colIndex = i % columnNum;
    const rowIndex = (i - colIndex) / columnNum;
    if (columnNum === 1) {
      grid.push({
        top: 90 + rowIndex * 268,
        right: 48,
        height: 180,
        width: 240,
        backgroundColor: '#fff',
        show: true,
        borderWidth: 80,
        borderColor: '#fff',
      });
    } else {
      grid.push({
        top: 90 + rowIndex * 288,
        left: `${colIndex * (100 / columnNum) + 10 / columnNum}%`,
        height: 180,
        width: `${80 / columnNum}%`,
        backgroundColor: '#fff',
        show: true,
        borderWidth: 80,
        borderColor: '#fff',
      });
    }

    yAxis.push({
      name: '并发数',
      gridIndex: i,
      ...commonYaxisConfig,
      splitLine: {
        ...commonYaxisConfig.splitLine,
        show: false,
      },
    });
    series.push({
      name: '并发数',
      xAxisIndex: i,
      yAxisIndex: 4 + i,
      data: chartsInfo.concurrent,
      color: '#56A4FF',
      ...commonSeriyConfig,
      // ...getAreaLinearConfig('#56A4FF'),
    });
  }

  return (
    <div style={{ position: 'relative' }}>
      {tooltip && (
        <Tooltip title={tooltip} arrowPointAtCenter placement="rightTop">
          <Icon
            type="question-circle"
            className="pointer"
            style={{
              marginRight: 16,
              color: 'var(--Netural-09, #9E9E9E)',
              position: 'absolute',
              top: 15,
              right: 10,
              zIndex: 1,
            }}
          />
        </Tooltip>
      )}
      <ReactEcharts
        style={{ width: '100%', height: 620 }}
        onEvents={onEvents}
        option={{
          grid,
          xAxis,
          yAxis,
          series,
          backgroundColor: '#F5F7F9',
          color: ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
            },
            formatter: (val) => {
              let str = `${val[0]?.axisValue} <br>`;
              let mutiSeriAdded = false;
              val.forEach((x) => {
                if (!(x.seriesName === '并发数' && mutiSeriAdded)) {
                  str += `${x.marker} ${x.seriesName} ${x.value}<br>`;
                }
                if (x.seriesName === '并发数') {
                  mutiSeriAdded = true;
                }
              });
              return str;
            },
          },
          // toolbox: {
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: 'none'
          //     },
          //     restore: {},
          //     saveAsImage: {}
          //   }
          // },
          dataZoom: [
            {
              show: true,
              type: 'slider',
              top: 10,
              left: columnNum === 1 ? undefined : 60,
              right: tooltip ? 60 : 10,
              width: columnNum === 1 ? 270 : undefined,
              realtime: true,
              start: 0,
              end: 100,
              xAxisIndex: [0, 1, 2, 3],
            },
            // {
            //   type: 'inside',
            //   realtime: true,
            //   start: 0,
            //   end: 100,
            //   xAxisIndex: [0, 1, 2, 3]
            // }
          ],
          axisPointer: {
            link: { xAxisIndex: 'all' },
          },
        }}
      />
      {chartsThreadInfo && JSON.stringify(chartsThreadInfo) !== '{}' && chartsThreadInfo?.concurrent && chartsThreadInfo?.concurrent?.length > 0 && <Row>
        <Col span={12}>
        <ReactEcharts 
          style={{ width: '100%', height: 320 }} 
          option={{
            grid: {
              left: 40,
              height: 180,
              backgroundColor: '#fff',
              show: true,
              borderWidth: 80,
              borderColor: '#fff',
            },
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                onZero: true,
                lineStyle: {
                  color: '#00BCD4',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: '#98A1B3',
              },
              data: chartsThreadInfo.concurrent,
            },
            yAxis: {
              name: 'TPS',
              ...commonYaxisConfig,
              splitLine: {
                ...commonYaxisConfig.splitLine,
                show: false,
              },
            },
            series : [
              {
                name: 'TPS',
                data: chartsThreadInfo.tps,
                color: '#56A4FF',
                ...commonSeriyConfig,
                // ...getAreaLinearConfig('#56A4FF'),
              }
            ],
            backgroundColor: '#F5F7F9',
            color: ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'],
          }} 
        />
        </Col>
        <Col span={12}>
           <ReactEcharts 
        style={{ width: '100%', height: 320 }} 
        option={{
          grid: {
            left: 40,
            height: 180,
            backgroundColor: '#fff',
            show: true,
            borderWidth: 80,
            borderColor: '#fff',
          },
          tooltip:{ trigger: 'axis' },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              onZero: true,
              lineStyle: {
                color: '#00BCD4',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#98A1B3',
            },
            data: chartsThreadInfo.concurrent,
          },
          yAxis: {
            name: '平均RT',
            ...commonYaxisConfig,
            splitLine: {
              ...commonYaxisConfig.splitLine,
              show: false,
            },
          },
          series : [
            {
              name: '平均RT',
              data: chartsThreadInfo.rt,
              color: '#56A4FF',
              ...commonSeriyConfig,
              // ...getAreaLinearConfig('#56A4FF'),
            }
          ],
          backgroundColor: '#F5F7F9',
          color: ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'],
        }} 
      />
       
        </Col>
      </Row> }
     
    </div>
  );
};
export default LineCharts;
