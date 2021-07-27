/**
 * @name
 * @author MingShined
 */
import { Line } from '@ant-design/charts';
import React from 'react';
import { MemeryAnalysingState } from '.';
import CardItem from '../../common/CardItem';

const GCElapsedTime: React.FC<MemeryAnalysingState> = props => {
  return (
    <CardItem title="GC耗时">
      <Line
        // yAxis={{ label: { formatter: text => `${text}GB` } }}
        height={400}
        data={props.chartMap.gcCost || []}
        smooth
        xField="time"
        yField="value"
        seriesField="type"
        // legend={{ position: 'bottom', itemHeight: 50 }}
        yAxis={{ label: { formatter: text => `${text}ms` } }}
        tooltip={{
          formatter: data => ({ name: data.type, value: `${data.value}ms` })
        }}
        // xAxis={{ tickCount: 10 }}
      />
    </CardItem>
  );
};
export default GCElapsedTime;
