import React, { CSSProperties, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
interface Props {
  chartsInfo: any;
  style?: CSSProperties;
}
const StepCharts: React.FC<Props> = props => {
  const { chartsInfo, style = {} } = props;

  return (
    <Fragment>
      <ReactEcharts
        style={{ height: 190, ...style }}
        option={{
          color: ['#00BCD4'],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: [
            {
              type: 'value',
              splitNumber: 10,
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              symbolSize: 0,
              type: 'line',
              step: 'start',
              data: props.chartsInfo,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#BCE8E2' // 0% 处的颜色
                  }, {
                    offset: 1, color: 'rgba(185, 229, 236, 0.19)' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                },
              },
            }
          ]
        }}
      />
    </Fragment>
  );
};
export default StepCharts;
