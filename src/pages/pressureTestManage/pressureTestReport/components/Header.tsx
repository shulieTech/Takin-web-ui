import React, { Fragment } from 'react';
import { Row, Col } from 'antd';
interface Props {
  list: any[];
  isExtra: boolean;
}
const Header: React.FC<Props> = props => {
  return (
    <Row type="flex" style={{ position: 'relative' }}>
      {props.list.map((item, k) => {
        if (!item.notShow) {
          return (
            <Col key={k} style={{ marginRight: 40 }}>
              <span style={{ color: '#A2A6B1' }}>{item.label}</span>：
              <span style={{ color: '#646676' }}>
                {item.value ? item.value : '-'}
              </span>
            </Col>
          );
        }
      })}
      {props.isExtra && (
        <p
          style={{
            color: '#A2A6B1',
            position: 'absolute',
            top: 0,
            right: 20
          }}
        >
          数据每 5s 刷新一次
        </p>
      )}
    </Row>
  );
};
export default Header;
