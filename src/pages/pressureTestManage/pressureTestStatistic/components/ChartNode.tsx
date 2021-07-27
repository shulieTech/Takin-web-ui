/**
 * @name
 * @author MingShined
 */
import { Pie } from '@ant-design/charts';
import { Card, Col, Row } from 'antd';
import { useStateReducer } from 'racc';
import React, { useEffect, useRef } from 'react';
import { PressureTestStatisticChildrenProps } from '../indexPage';
import PressureTestStatisticService from '../service';
import { transformDatekey } from '../utils';

interface Props extends PressureTestStatisticChildrenProps {
  color: string[] | ((item: any) => string);
  type: string;
  title: string;
}

const ChartNode: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    data: [],
    total: 0
  });
  const chartRef = useRef(null);
  useEffect(() => {
    if (!props.date.length) {
      return;
    }
    getChartInfo();
  }, [props.date]);
  useEffect(() => {
    chartRef.current.on('legend-item:click', e => {
      // e.stopPropagation();
    });
  }, []);
  const getChartInfo = async () => {
    const {
      data: { data, success }
    } = await PressureTestStatisticService.getChartInfo({
      type: props.type,
      ...transformDatekey(props.date)
    });
    if (success) {
      setState({
        data: data.data,
        total: data.total
      });
    }
  };
  const config = {
    data: state.data || [],
    appendPadding: 10,
    radius: 0.8,
    innerRadius: 0.7,
    angleField: 'value',
    colorField: 'type',
    interactions: [{ type: 'element-active' }],
    label: {
      type: 'spider',
      layout: 'fixedOverlap',
      labelHeight: 38,
      // labelWidth: 400,
      // content: '{name}\n{percentage}'
      content: data => {
        const value = (data.percent * 100).toFixed(2);
        return `${data.type}\n${value}%`;
      }
    }
  };
  return (
    <Card
      bodyStyle={{
        background: +props.current === +props.type && '#eee'
      }}
    >
      <Row type="flex" style={{ height: 250 }}>
        <Col style={{ position: 'absolute' }}>
          <h1 className="ft-24">{props.title}</h1>
          <h1 style={{ fontSize: 50 }}>{state.total || 0}</h1>
        </Col>
        <Col className="flex-1">
          <Pie
            padding={[0, 0, 0, 90]}
            legend={{ position: 'left-bottom' }}
            chartRef={chartRef}
            statistic={null}
            color={props.color}
            autoFit={true}
            {...config}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default ChartNode;
