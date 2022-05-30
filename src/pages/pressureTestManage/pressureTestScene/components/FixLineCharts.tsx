import React, { CSSProperties, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
interface Props {
  chartsInfo: any;
  style?: CSSProperties;
}
const FixLineCharts: React.FC<Props> = props => {
  const { chartsInfo, style = {} } = props;
  // console.log(chartsInfo);
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
