/**
 * @name
 * @author MingShined
 */
import { DualAxes } from '@ant-design/charts';
import React, { useEffect, useRef } from 'react';
import { ThreadInitStateProps } from '.';
import CardItem from '../../common/CardItem';
import { tipColor } from '../../enum';
interface Props extends ThreadInitStateProps {
  setThreadState: (state: Partial<ThreadInitStateProps>) => void;
}
const ThreadChart: React.FC<Props> = ({
  threadCpuData,
  setThreadState,
  time
}) => {
  const chartRef = useRef(null);
  useEffect(() => {
    // chartRef.current.on('axis-label:click', config => {
    //   const time = config.target.attrs.text;
    //   if (time.indexOf(':') !== -1) {
    //     setThreadState({ time: config.target.attrs.text });
    //   }
    // });

    chartRef.current.on('element:click', conf => {
      if (conf.data.shape === 'circle') {
        setThreadState({
          time: conf.data.data.time
        });
      }
    });
  }, []);

  const config = {
    data: [threadCpuData, threadCpuData],
    height: 400,
    xField: 'time',
    yField: ['threadCount', 'cpuRate']
  };
  const labelMap = {
    cpuRate: 'CPU利用率',
    threadCount: '线程数'
  };
  return (
    <CardItem
      title={
        <span>
          线程数&CPU利用率趋势图
          <span
            style={{
              color: tipColor,
              fontWeight: 'normal',
              fontSize: 14,
              marginLeft: 8
            }}
          >
            (点击趋势图节点可查看线程详情)
          </span>
        </span>
      }
    >
      <DualAxes
        chartRef={chartRef}
        yAxis={[
          {},
          {
            label: { formatter: text => `${text}%` }
          }
        ]}
        geometryOptions={[
          {
            point: {
              shape: 'circle',
              size: 2,
              style: {
                opacity: 0.5,
                stroke: '#5AD8A6',
                fill: '#fff',
                cursor: 'pointer'
              }
            }
          },
          {
            point: {
              shape: 'circle',
              size: 5,
              style: {
                opacity: 0.5,
                stroke: '#5AD8A6',
                fill: '#fff',
                cursor: 'pointer'
              }
            }
          }
        ]}
        tooltip={{
          showCrosshairs: true,
          formatter: data => {
            const keys = Object.keys(data);
            return {
              name: labelMap[keys[1]],
              value: data.threadCount || (data.cpuRate ? `${data.cpuRate}%` : 0),
            };
          },
          crosshairs: {
            line: {
              style: {
                cursor: 'pointer'
              }
            }
          }
        }}
        legend={{
          itemName: {
            formatter: text => labelMap[text]
          }
        }}
        {...config}
      />
    </CardItem>
  );
};
export default ThreadChart;
