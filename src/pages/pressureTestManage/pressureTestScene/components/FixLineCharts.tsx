import React, { Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
interface Props {
  chartsInfo: any;
}
const FixLineCharts: React.FC<Props> = props => {
  const { chartsInfo } = props;
  // console.log(chartsInfo);
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
              boundaryGap: false,
              splitNumber: 10
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: { onZero: false }
            }
          ],
          series: [
            {
              type: 'line',
              data: props.chartsInfo
            }
          ]
        }}
      />
    </Fragment>
  );
};
export default FixLineCharts;
