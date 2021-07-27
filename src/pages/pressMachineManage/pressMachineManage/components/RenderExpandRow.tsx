import { Line } from '@ant-design/charts';
import { Col, Row } from 'antd';
import moment from 'moment';
import { DatePick } from 'racc';
import React, { Fragment } from 'react';
import { PressMachineManageEnum } from '../enum';

const renderExpandRow = (state, setState) => {
  if (!state.chartDataMap) {
    return null;
  }
  const chartMap = [
    {
      title: 'CPU利用率',
      key: PressMachineManageEnum.CPU利用率
    },
    {
      title: 'CPU load',
      key: PressMachineManageEnum['CPU load']
    },
    {
      title: '内存利用率',
      key: PressMachineManageEnum.内存利用率
    },
    {
      title: '磁盘I/O等待率',
      key: PressMachineManageEnum['磁盘I/O等待率']
    },
    {
      title: '网络带宽使用率',
      key: PressMachineManageEnum.网络带宽使用率
    }
  ];
  return (
    <Fragment>
      <div className="ft-rt">
        <DatePick
          value={state.queryTime}
          onChange={queryTime => setState({ queryTime })}
          datePickerProps={{
            disabledDate: current =>
              current > moment() || current < moment().subtract(15, 'day')
          }}
        />
      </div>
      <Row justify="space-between" type="flex" gutter={208}>
        {chartMap.map(item => (
          <Col
            style={{ width: '50%', height: 300, paddingBottom: 84 }}
            key={item.key}
          >
            <h1 className="ft-20 mg-b2x">{item.title}</h1>
            <Line
              // height={250}
              xField="date"
              yField="value"
              xAxis={{
                label: {
                  formatter: text => moment(text).format('HH:mm')
                },
                tickCount: 12
              }}
              yAxis={{
                label: {
                  formatter: text =>
                    item.key === PressMachineManageEnum['CPU load']
                      ? text
                      : `${text}%`
                }
              }}
              tooltip={{
                formatter: data => {
                  return {
                    name: item.title,
                    value:
                      item.key === PressMachineManageEnum['CPU load']
                        ? data.value
                        : `${data.value}%`
                  };
                },
                showCrosshairs: true,
                shared: true
              }}
              data={state.chartDataMap[item.key]}
              // lineStyle={{ fill: 'rgb(226, 241, 255)' }}
            />
          </Col>
        ))}
      </Row>
    </Fragment>
  );
};

export default renderExpandRow;
