/**
 * @name
 * @author MingShined
 */
import { Line } from '@ant-design/charts';
import { Spin } from 'antd';
import { renderToolTipItem } from 'racc';
import React, { useContext, useEffect, useState } from 'react';
import { ThreadInitStateProps } from '.';
import CardItem from '../../common/CardItem';
import { ThreadContext } from '../../context';
import { tipColor } from '../../enum';
import AnalysisService from '../../service';

interface Props extends ThreadInitStateProps {
  setThreadState: (state: Partial<ThreadInitStateProps>) => void;
  query: any;
}
const CpuUseRatio: React.FC<Props> = props => {
  const text = 'CPU利用率';
  if (!props.selectThreadName) {
    return (
      <CardItem title={text}>
        {/* <div>暂无数据</div> */}
        <div style={{ color: tipColor }}>请先在左边进行线程选择</div>
      </CardItem>
    );
  }
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state } = useContext(ThreadContext);
  useEffect(() => {
    if (props.selectThreadName) {
      getChartData();
    }
  }, [props.threadStackLink]);
  const getChartData = async () => {
    setLoading(true);
    const {
      data: { data, success }
    } = await AnalysisService.queryCpuChart({
      reportId: props.query.reportId,
      threadName: props.selectThreadName,
      appName: state.appName,
      processName: state.processName
    });
    if (success) {
      setChartData(data);
      setLoading(false);
    }
  };
  const config = {
    data: chartData,
    xField: 'time',
    yField: 'threadCpuUseRate',
    smooth: true,
    height: 400
  };
  return (
    <CardItem
      title={
        <span>
          {text} - {renderToolTipItem(props.selectThreadName, 30)}
        </span>
      }
    >
      <Spin spinning={loading}>
        <Line
          tooltip={{
            formatter: data => ({
              name: 'CPU利用率',
              value: `${data.threadCpuUseRate}%`
            })
          }}
          yAxis={{ label: { formatter: t => `${t}%` } }}
          {...config}
        />
      </Spin>
    </CardItem>
  );
};
export default CpuUseRatio;
