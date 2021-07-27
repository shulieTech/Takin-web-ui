import { Alert, Tooltip } from 'antd';
import { AlertProps } from 'antd/lib/alert';
import React, { Fragment } from 'react';
import styles from './index.less';

interface Props extends AlertProps {
  title?: string | React.ReactNode;
  content?: string | React.ReactNode;
  types?: 'info' | 'warning' | 'success' | 'error' | 'business';
}
const CustomAlert: React.FC<Props> = props => {
  return (
    <Alert
      icon={
        <img
          style={{ width: 20, marginTop: -2 }}
          src={require(`./../../assets/${
            props.types ? AlertTypes[props.types] : AlertTypes.info
          }.png`)}
        />
      }
      {...props}
      message={
        <div style={{ lineHeight: '26px' }}>
          {props.title && <span className={styles.title}>{props.title}</span>}
          {props.content && (
            <span style={{ marginLeft: 8 }}>{props.content}</span>
          )}
        </div>}
      className={props.types ? styles[props.types] : styles.info}
    />
  );
};
export default CustomAlert;

/**
 * @name alert类型
 */
enum AlertTypes {
  info = 'alert_info_icon',
  success = 'alert_success_icon',
  error = 'alert_error_icon',
  warning = 'alert_warning_icon',
  business = 'alert_business_icon'
}
