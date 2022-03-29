import React, { useState, useEffect, useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import service from '../service';
import LegendSelect from '../../TrendChart/components/LegendSelect';

interface Props {}

const TimeCostChart: React.FC<Props> = (props) => {
  const echartRef = useRef();
  const [chartData, setChartData] = useState({
    time: [
      '2022-03-11',
      '2022-03-12',
      '2022-03-13',
      '2022-03-14',
      '2022-03-15',
    ],
    list: [
      {
        name: '/provider/co',
        data: [1, 2, 3, 4, 5],
      },
      {
        name: '/provider/ao',
        data: [3, 2, 1, 7, 5],
      },
      {
        name: '/provider/bo',
        data: [2, 4, 6, 3, 2],
      },
    ],
  });

  const [seriesShowed, setSeriesShowed] = useState(
    chartData.list.slice(0, 5).map((item) => item.name)
  );

  return (
    <div>
      <ReactEcharts
        ref={echartRef}
        style={{ width: '100%', height: 400 }}
        option={{
          color: [
            '#6CBEDC',
            '#79D193',
            '#66BCDB',
            '#ECBB35',
            '#DF7672',
            '#5A97E0',
            '#90CDAC',
            '#6462B9',
          ],
          xAxis: {
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
          },
          yAxis: {
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
          },
          series: chartData.list.map((item, index) => {
            return {
              type: 'line',
              stack: true, // 堆叠效果
              showSymbol: true,
              hoverAnimation: false,
              smooth: true,
              name: item.name,
              data: item.data,
              areaStyle: {
                opacity: 0.25,
              },
            };
          }),
          legend: {
            show: false,
          }
        }}
      />
      <LegendSelect
        style={{
          position: 'absolute',
          left: 16,
          right: 0,
          height: 56,
          top: 60,
        }}
        label="接口"
        searchPlaceholder="搜索接口"
        allSeries={chartData.list}
        echartInstance={echartRef.current?.getEchartsInstance()}
        seriesShowed={seriesShowed}
        onChangeShowedSeries={setSeriesShowed}
      />
    </div>
  );
};

export default TimeCostChart;
