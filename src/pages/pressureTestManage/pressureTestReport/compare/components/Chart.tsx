import React from 'react';
import ReactEcharts from 'echarts-for-react';

const Chart = (props) => {
  const { data = [] } = props;
  const grid = [];
  const xAxis = [];
  const yAxis = [];
  const series = [];

  const maxTime = Math.max(...data.map(x => x.time?.length));
  // 不同报告的压测时间不同，使用压测时间最长的为准，并使用5s为间隔
  const timeArr = Array.from({ length: maxTime }).map((x, i) =>  i * 5);

  const seriesConfig = [
    {
      name: '并发数',
      dataIndex: 'concurrent',
    },
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

  seriesConfig.forEach((x, i) => {
    grid.push({
      height: 180,
      top: 260 * i + 80
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
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#98A1B3',
      },
      data: timeArr,
      gridIndex: i,
    });

    yAxis.push({
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
      gridIndex: i,
      name: x.name,
    });

    data.forEach(y => {
      series.push({
        type: 'line',
        showSymbol: true,
        hoverAnimation: false,
        smooth: true,
        name: y.id,
        xAxisIndex: i,
        yAxisIndex: i,
        data: y[x.dataIndex],
        color: undefined,
      });
    });
  });

  return (
    <ReactEcharts
      style={{
        width: '100%',
        height: 1500,
        marginTop: 24,
      }}
      option={{
        grid,
        xAxis,
        yAxis,
        series,
        legend: {
          show: true,
          top: 20,
        },
        backgroundColor: '#F5F7F9',
        color: ['#00CBBF', '#ffa425', '#e64d03', '#00d77d', '#eaa4a1'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false,
          },
          // formatter: (val) => {
          //   let str = `${val[0]?.axisValue} <br>`;
          //   let mutiSeriAdded = false;
          //   val.forEach((x) => {
          //     if (!(x.seriesName === '并发数' && mutiSeriAdded)) {
          //       str += `${x.marker} ${x.seriesName} ${x.value}<br>`;
          //     }
          //     if (x.seriesName === '并发数') {
          //       mutiSeriAdded = true;
          //     }
          //   });
          //   return str;
          // },
        },
      }}
    />
  );
};

export default Chart;
