import React from 'react';
import { notification } from 'antd';
import styles from './index.less';

export function openNotification(message, desc = '') {
  notification.success({
    message: <p className={styles.message}>{message}</p>,
    description: <div className={styles.desc}>{desc}</div>,
    duration: 3
  });
}
