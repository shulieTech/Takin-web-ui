/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import React, { Fragment, useEffect, useState } from 'react';
import { TabMap } from '../enum';
import { PressureTestStatisticChildrenProps } from '../indexPage';
import PressureTestStatisticService from '../service';
import { transformDatekey } from '../utils';
import TableNode from './TableNode';

const SceneNode: React.FC<PressureTestStatisticChildrenProps> = props => {
  return (
    <Fragment>
      <StatisticTotal {...props} />
      <TableNode {...props} title="压测次数 Top5 场景" type={TabMap.压测场景} />
    </Fragment>
  );
};
export default SceneNode;

const StatisticTotal: React.FC<PressureTestStatisticChildrenProps> = props => {
  const [info, setInfo] = useState({});
  useEffect(() => {
    if (!props.date.length) {
      return;
    }
    getInfo();
  }, [props.date]);
  const getInfo = async () => {
    const {
      data: { data, success }
    } = await PressureTestStatisticService.getReportInfo({
      ...transformDatekey(props.date)
    });
    if (success) {
      setInfo(data);
    }
  };
  const titleMap = [
    {
      label: '压测报告',
      color: '#333',
      key: 'count'
    },
    {
      label: '通过',
      color: 'green',
      key: 'success'
    },
    {
      label: '不通过',
      color: 'red',
      key: 'fail'
    }
  ];
  return (
    <Row
      style={{ background: '#eee', margin: '24px 0' }}
      type="flex"
      justify="space-around"
    >
      {titleMap.map(item => (
        <Col key={item.key} style={{ fontWeight: 'bold' }}>
          <Row type="flex" align="middle">
            <Col style={{ fontSize: 24 }}>{item.label}</Col>
            <Col style={{ marginLeft: 40, fontSize: 50, color: item.color }}>
              {info[item.key] || 0}
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
};
