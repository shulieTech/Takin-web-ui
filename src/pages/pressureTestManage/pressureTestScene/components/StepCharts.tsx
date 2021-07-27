import React, { Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
interface Props {
  chartsInfo: any;
}
const StepCharts: React.FC<Props> = props => {
  const { chartsInfo } = props;

  return (
    <Fragment>
      <ReactEcharts
        style={{ width: 500, height: 190 }}
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
