/**
 * @name
 * @author MingShined
 */
import { Line } from '@ant-design/charts';
import React from 'react';
import { MemeryAnalysingState } from '.';
import CardItem from '../../common/CardItem';

const GCTime: React.FC<MemeryAnalysingState> = props => {
  const data = props.chartMap.gcCount || [];
  return (
    <CardItem title="GC次数">
      <Line
        // yAxis={{ label: { formatter: text => `${text}GB` } }}
        height={400}
        data={data}
        smooth
        xField="time"
        yField="value"
        seriesField="type"
        // xAxis={{ tickCount: 10 }}
      />
    </CardItem>
  );
};
export default GCTime;
