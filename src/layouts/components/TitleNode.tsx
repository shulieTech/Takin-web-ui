/**
 * @name
 * @author MingShined
 */
import React, { useState } from 'react';
import styles from '../index.less';
import venomBasicConfig from 'src/venom.config';
import Title from 'antd/lib/typography/Title';
import { Icon, Button } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

interface Props {
  onCollapsed?: () => void;
  collapsedStatus?: boolean;
  location?: any;
}
const TitleNode: React.FC<Props> = props => {
  const { location } = props;
  let url = '/';
  if (localStorage.getItem('trowebUserResource')) {
    const data = JSON.parse(localStorage.getItem('trowebUserResource'));
    const urlString =
      Object.keys(data) && Object.keys(data).sort((a: any, b: any) => a - b)[0];
    const urls = urlString && urlString.replace(/_/, '/');
    url = urls ? `/${urls}` : '/';
  }

  if (location.pathname) {
    url = location.pathname;
  }

  return (
    <Link to={url}>
      <Title
        className={styles.logo}
        style={{
          width:
            venomBasicConfig.theme === 'dark'
              ? !props.collapsedStatus
                ? venomBasicConfig.siderWidth
                : '80px'
              : !props.collapsedStatus
                ? +venomBasicConfig.siderWidth - 1
                : '79px',

          height: venomBasicConfig.headerHeight,
          marginBottom: 0,
          padding: 10,
          background:
            venomBasicConfig.theme === 'dark'
              ? 'var(--BrandPrimary-500)'
              : '#fff',
          color: venomBasicConfig.theme === 'dark' ? '#fff' : '#1890ff',
          boxShadow:
            venomBasicConfig.theme === 'light' && '1px 1px 0 0 #e8e8e8',
          borderBottom: '1px solid var(--BrandPrimary-500)'
        }}
      >
        <div className={styles.titleName}>
          中国人寿压测平台
        </div>

        <Button
          type="link"
          onClick={props.onCollapsed}
          className={props.collapsedStatus ? styles.menuClose : styles.menuOpen}
        >
          <Icon
            type={props.collapsedStatus ? 'menu-unfold' : 'menu-fold'}
            style={{ color: '#fff' }}
          />
        </Button>
      </Title>
    </Link>
  );
};

export default TitleNode;
