import React, { useState, useEffect, useCallback } from 'react';
import { Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import service from '../service';
import LegendSelect, {
  getSeryColorByNameOrIndex,
} from '../../TrendChart/components/LegendSelect';

interface Props {
  defaultQuery: any;
}

const TimeCostChart: React.FC<Props> = (props) => {
  const [echartRef, setEchartRef] = useState();
  const [loading, setLoading] = useState(false);
  const [allSeries, setAllSeries] = useState([]);
  const [seriesShowed, setSeriesShowed] = useState([]);

  const [chartData, setChartData] = useState({
    time: [],
    list: [],
  });

  const getNodes = async () => {
    const {
      data: { success, data = [] },
    } = await service.performanceInterfaceList(props.defaultQuery);
    if (success) {
      setAllSeries((data || []).map((item) => ({ ...item, name: item.serviceName })));
      const _seriesShowed = (data || [])
        .slice(0, 5);
      setSeriesShowed(_seriesShowed.map(x => x.serviceName));
      getChartData({
        services: _seriesShowed,
      });
    }
  };

  const getChartData = async (params = {}) => {
    setLoading(true);
    const {
      data: { success, data = [] },
    } = await service.performanceInterfaceCostTrend({
      ...props.defaultQuery,
      ...params,
    });
    setLoading(false);
    if (success) {
      data.list = (data.list || []).map((item) => ({
        ...item,
        name: item.serviceName,
      }));
      setChartData(data);
    }
  };

  useEffect(() => {
    getNodes();
  }, [props.defaultQuery?.xpathMd5]);

  return (
    <Spin spinning={loading}>
      <div
        style={{
          color: 'var(--Netural-600, #90959A)',
          fontSize: 12,
          padding: '16px 0',
        }}
      >
        默认展示耗时占比前五项数据 ，可在图例中进行切换
      </div>
      <LegendSelect
        label="接口"
        searchPlaceholder="搜索接口"
        allSeries={allSeries}
        echartRef={echartRef}
        seriesShowed={seriesShowed}
        onChangeShowedSeries={(nodeNames, nodes) => {
          setSeriesShowed(nodeNames);
          getChartData({ services: nodes });
        }}
        overlayStyle={{
          width: 400,
        }}
        extraColumns={[
          {
            title: '耗时',
            align: 'right',
            render: (text, record) => {
              return (
                <span
                  style={{
                    color: 'var(--Netural-500, #AEB2B7)',
                  }}
                >
                  {record.reqCnt || 0}/{record.avgCost || 0}
                </span>
              );
            },
          },
        ]}
      />
      <ReactEcharts
        ref={useCallback((echarts) => setEchartRef(echarts), [])}
        style={{ width: '100%', height: 400 }}
        option={{
          grid: {
            top: 40,
            left: 50,
            right: 50,
          },

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
          series: (chartData?.list || []).map((item, index) => {
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
              color: getSeryColorByNameOrIndex({ list: allSeries, name: item.name }),
            };
          }),
          legend: {
            show: false,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false,
            },
          },
        }}
      />
    </Spin>
  );
};

export default TimeCostChart;
