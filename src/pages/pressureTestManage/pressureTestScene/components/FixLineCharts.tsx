import React, { CSSProperties, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
interface Props {
  chartsInfo: any;
  style?: CSSProperties;
}
const FixLineCharts: React.FC<Props> = (props) => {
  const { chartsInfo, style = {} } = props;
  // console.log(chartsInfo);
  return (
    <Fragment>
      <ReactEcharts
        style={{ height: 190, ...style }}
        option={{
          grid: {
            top: 20,
            left: 40,
            right: 10,
            bottom: 40,
          },
          color: ['#00BCD4'],
          tooltip: {
            trigger: 'axis',
          },
          xAxis: [
            {
              type: 'value',
              boundaryGap: false,
              splitNumber: 10,
              splitLine: {
                lineStyle: {
                  color: '#EEF0F2',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#90959A',
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#90959A',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#EEF0F2',
                },
              },
            },
          ],
          series: [
            {
              type: 'line',
              data: props.chartsInfo,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: '#BCE8E2', // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(185, 229, 236, 0.19)', // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
              },
            },
          ],
        }}
      />
    </Fragment>
  );
};
export default FixLineCharts;
