import React from 'react';
import { Icon } from 'antd';
import { Link } from 'umi';
import styles from '../index.less';

export default (props) => {
  return (
    <Link to="">
      <div className={styles['introduce-guide']}>
        <div style={{ display: 'inline-block' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--Netural-990, #25282A)',
            }}
          >
            新压测方式指引
          </div>
          <div
            style={{
              display: 'inline-block',
              color: 'var(--Netural-600, #90959A)',
              padding: '16px 0',
              borderBottom: '1px solid var(--Netural-100, #EEF0F2)',
              marginBottom: 24,
              paddingRight: 24,
            }}
          >
            无需Jmeter
            <span className={styles.divider} />
            无需手动梳理隔离数据
            <span className={styles.divider} />
            数据变更后也能精准识别
            <span className={styles.divider} />
            效率提升50%
          </div>
          <div
            style={{
              color: 'var(--Netural-990, #25282A)',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <span className={styles.order}>1</span>
            <span>链路资源配置</span>
            <Icon
              type="right"
              style={{ margin: '0 32px', color: 'var(--Netural-400, #BFC3C8)' }}
            />
            <span className={styles.order}>2</span>
            <span>压测场景编辑</span>
            <Icon
              type="right"
              style={{ margin: '0 32px', color: 'var(--Netural-400, #BFC3C8)' }}
            />
            <span className={styles.order}>3</span>
            <span>压测执行</span>
            <Icon
              type="right"
              style={{ margin: '0 32px', color: 'var(--Netural-400, #BFC3C8)' }}
            />
            <span className={styles.order}>4</span>
            <span>查看压测报告</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
