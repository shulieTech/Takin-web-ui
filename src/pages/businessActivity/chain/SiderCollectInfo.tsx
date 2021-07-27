/**
 * @name
 * @author MingShined
 */
import { Col, Icon, Popover, Row } from 'antd';
import React, { Fragment } from 'react';
import styles from '../index.less';
import ErrorList from './ErrorList';
interface Props {}
const SiderCollectInfo: React.FC<Props> = props => {
  return (
    <Fragment>
      <ErrorList />
    </Fragment>
  );
};
export default SiderCollectInfo;

export const PopoverCard: React.FC<{
  title: string | React.ReactNode;
  content: React.ReactNode;
  overlayStyle?: React.CSSProperties;
}> = props => {
  return (
    <Popover
      trigger="click"
      placement="rightTop"
      content={props.content}
      title={props.title}
      overlayStyle={props.overlayStyle}
      overlayClassName={styles.popover}
    >
      <Row
        align="middle"
        type="flex"
        justify="space-between"
        className="pd-2x pointer"
      >
        <Col>{props.children}</Col>
        <Col>
          <Icon style={{ color: '#D9D9D9' }} type="caret-right" />
        </Col>
      </Row>
    </Popover>
  );
};
