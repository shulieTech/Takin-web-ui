import { Col, Row, Tooltip } from 'antd';
import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  color: string;
  imgName: string;
  tooltipString?: string;
  imgWidth?: number;
  iconWidth?: number;
}
const CustomIcon: React.FC<Props> = props => {
  const { color, imgName, imgWidth, iconWidth } = props;

  return (
    <Row
      type="flex"
      align="middle"
      justify="center"
      className={styles.circleWrap}
      style={{ background: color, width: iconWidth, height: iconWidth }}
    >
      <Col>
        <img
          style={{ width: imgWidth || 15 }}
          src={require(`./../../assets/${imgName}.png`)}
        />
      </Col>
    </Row>
  );
};
export default CustomIcon;
