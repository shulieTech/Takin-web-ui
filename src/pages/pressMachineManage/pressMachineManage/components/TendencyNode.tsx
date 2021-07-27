/**
 * @name
 * @author MingShined
 */
import { Line } from '@ant-design/charts';
import { Card, message } from 'antd';
import moment from 'moment';
import { DatePick, useStateReducer } from 'racc';
import React, { useEffect } from 'react';
import { DayMap } from '../enum';
import PressMachineManageService from '../service';
import { timerInterval } from '../utils';
interface Props {}
const TendencyNode: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    date: [
      moment()
        .subtract('day', 7)
        .format('YYYY-MM-DD HH:mm:ss'),
      moment().format('YYYY-MM-DD HH:mm:ss')
    ],
    data: []
  });
  useEffect(() => {
    let timer = null;
    getInfo();
    timer = setInterval(() => {
      getInfo();
    }, timerInterval);
    return () => clearInterval(timer);
  }, [state.date]);
  const getInfo = async () => {
    const {
      data: { data, success }
    } = await PressMachineManageService.getTrendInfo({
      startTime: state.date[0],
      endTime: state.date[1]
    });
    if (success && data) {
      setState({ data });
    }
  };
  const handleChangeDate = date => {
    if (!date.length) {
      return;
    }
    const end = moment(date[1]);
    const start = moment(date[0]);
    const diff = end.diff(start, 'day');
    if (diff > 30) {
      message.info('所选时间区间不能大于30天');
      return;
    }
    setState({ date });
  };
  const extra: React.ReactNode = (
    <DatePick
      rangePickerProps={{
        disabledDate: current =>
          current > moment() || current < moment().subtract('month', 3)
      }}
      value={state.date}
      onChange={handleChangeDate}
      type="range"
    />
  );
  return (
    <Card title="压力机趋势统计" extra={extra}>
      <Line
        data={state.data}
        xField="date"
        smooth
        height={285}
        tooltip={{ enterable: true, shared: true, showCrosshairs: true }}
        legend={{ position: 'bottom', padding: [40, 0, 0, 0] }}
        yField="value"
        seriesField="type"
        xAxis={{
          label: {
            formatter: text => {
              return `${moment(text).format('MM-DD')} ${
                DayMap[moment(text).day()]
              }`;
            }
          },
          tickInterval: 3
        }}
      />
    </Card>
  );
};
export default TendencyNode;