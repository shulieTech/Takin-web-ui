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
          color: ['#FFB64A'],
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
              data: props.chartsInfo
            }
          ]
        }}
      />
    </Fragment>
  );
};
export default StepCharts;
