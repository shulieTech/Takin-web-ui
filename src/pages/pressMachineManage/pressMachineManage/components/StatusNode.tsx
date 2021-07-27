/**
 * @name
 * @author MingShined
 */
import { Pie } from '@ant-design/charts';
import { Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { PressMachineManageEnum, StatisticMap } from '../enum';
import PressMachineManageService from '../service';
import { timerInterval } from '../utils';
interface Props {}
const StatusNode: React.FC<Props> = props => {
  const [state, setState] = useState({
    chartData: [],
    statisticInfo: {}
  });
  useEffect(() => {
    let timer = null;
    getInfo();
    timer = setInterval(() => {
      getInfo();
    }, timerInterval);
    return () => clearInterval(timer);
  }, []);
  const getInfo = async () => {
    const {
      data: { data, success }
    } = await PressMachineManageService.getStatisticsInfo();
    if (success && data) {
      const chartData = Object.keys(StatisticMap).map(key => {
        const item = StatisticMap[key];
        return {
          type: item.label,
          value: data[key],
          color: item.color,
          percent: item.percent
        };
      });
      setState({ chartData, statisticInfo: data });
    }
  };
  const config = {
    data: state.chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.7,
    statistic: {
      title: {
        formatter: () => '压力机总数',
      },
      content: {
        offsetY: 10,
        style: { fontSize: 24 },
        formatter: function formatter() {
          return `${state.statisticInfo[PressMachineManageEnum.压力机总数] ||
            ''}台`;
        }
      }
    }
  };
  const renderLegend = () => {
    return state.chartData.map((item, index) => ({
      name: `${item.type}${item.type !== '压测中' ? '   ' : ''}   ${state
        .statisticInfo[item.percent].toFixed(2) * 100}%    ${item.value}台`,
      value: item.value,
      id: index.toString(),
      marker: {
        style: {
          fill: item.color
        }
      }
    }));
  };
  return (
    <Card title="压力机状态统计">
      <Pie
        padding={[0, 180, 0, 0]}
        legend={{
          offsetX: -60,
          // custom: true,
          // items: renderLegend(),
          itemName: {
            style: {
              fontSize: 14
            },
            formatter: text => {
              const item = state.chartData.find(i => i.type === text);
              return `${item.type}${
                item.type !== '压测中' ? '   ' : ''
              }   ${(+state.statisticInfo[item.percent] * 100).toFixed(2)}%    ${
                item.value
              }台`;
            }
          }
          // itemName: {
          //   formatter: (text, item) => {
          //     console.log(item);
          //     return 1;
          //   }
          // }
        }}
        color={item => {
          const curKey = Object.keys(StatisticMap).find(
            key => StatisticMap[key].label === item.type
          );
          return StatisticMap[curKey].color;
        }}
        height={300}
        {...config}
      />
    </Card>
  );
};
export default StatusNode;
