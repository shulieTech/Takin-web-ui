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
          style={{ width: 20 }}
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
      style={{
        backgroundColor: AlertBgStyleTypes[props.types],
        borderColor: AlertBorderStyleTypes[props.types]
      }}
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

/**
 * @name alert类型style
 */
enum AlertBgStyleTypes {
  info = '#F5FFFE',
  success = '#F5FFFE',
  error = '#FFF7F8',
  warning = '#FFF8EE',
  business = '#F5FFFE'
}

/**
 * @name alert类型style
 */
enum AlertBorderStyleTypes {
  info = '#E4FBF9',
  success = '#E4FBF9',
  error = '#FBD2D5',
  warning = '#FFE2B8',
  business = '#E4FBF9'
}
