import React from 'react';
import { Spin, Row } from 'antd';

const Loading: React.FC = () => {
  return (
    <Row justify="center" align="middle" type="flex" style={{ height: '100%' }}>
      <Spin spinning={true} />
    </Row>
  );
};

export default Loading;