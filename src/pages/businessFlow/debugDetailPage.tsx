import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import { MainPageLayout } from 'src/components/page-layout';
interface Props {}
const DebugDetail: React.FC<Props> = props => {
  return <MainPageLayout title="场景调试">
      <Row type="flex">
        <Col>
        1
        </Col>
        <Col>
        2
        </Col>
      </Row>
    </MainPageLayout>;
};
export default DebugDetail;