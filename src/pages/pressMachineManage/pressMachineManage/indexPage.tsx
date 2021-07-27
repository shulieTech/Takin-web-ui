/**
 * @name
 * @author MingShined
 */
import { Col, Row } from 'antd';
import React from 'react';
import { MainPageLayout } from 'src/components/page-layout';
import ListNode from './components/ListNode';
import StatusNode from './components/StatusNode';
import TendencyNode from './components/TendencyNode';
interface Props {}
const pressMachineManage: React.FC<Props> = props => {
  return (
    <MainPageLayout>
      <Row type="flex" gutter={48} className="mg-b4x">
        <Col style={{ width: 500 }}>
          <StatusNode />
        </Col>
        <Col className="flex-1">
          <TendencyNode />
        </Col>
      </Row>
      <ListNode />
    </MainPageLayout>
  );
};
export default pressMachineManage;
