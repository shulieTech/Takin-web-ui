/**
 * @name
 * @author MingShined
 */
import { Col, Divider, Icon, Row } from 'antd';
import React, { useContext } from 'react';
import { getTakinAuthority } from 'src/utils/utils';
import { router } from 'umi';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { ActivityBean } from '../enum';
import styles from '../index.less';

interface Props {}
const HeaderNode: React.FC<Props> = props => {
  const { state } = useContext(BusinessActivityDetailsContext);
  const divider: React.ReactNode = (
    <Divider
      type="vertical"
      style={{ height: 16, width: 1, background: '#f0f0f0', margin: '0 16px' }}
    />
  );
  return (
    <Row
      align="middle"
      style={{ padding: '8px 24px', background: '#fff', height: 56 }}
      type="flex"
      justify="space-between"
    >
      <Col className="flex" style={{ alignItems: 'center' }}>
        <span
          style={{
            fontWeight: 'bold',
            color: 'var(--BrandPrimary-500)',
            fontSize: 16,
            cursor: 'pointer'
          }}
          onClick={() => router.push('/businessActivity')}
        >
          <Icon theme="outlined" className={styles.leftIcon} type="left" />
          返回
        </span>
        {divider}
        <span
          style={{
            fontWeight: 600,
            fontSize: 18,
            color: 'var(--Netural-14)'
          }}
        >
          业务活动详情
        </span>
        {divider}
        <span style={{ color: 'var(--Netural-14)', fontSize: 14 }}>
          {state.details[ActivityBean.业务活动名称]}
        </span>
      </Col>
      {getTakinAuthority() === 'true' && (
        <Col>负责人：{state.details[ActivityBean.负责人] || '--'}</Col>
      )}
    </Row>
  );
};
export default HeaderNode;
