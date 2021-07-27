/**
 * @name
 * @author MingShined
 */
import React, { Fragment } from 'react';
import InputNumber, { InputNumberProps } from 'antd/lib/input-number';
import styles from './index.less';
interface InputNumberProProps extends InputNumberProps {
  addonAfter?: string | React.ReactNode;
  addonBefore?: string | React.ReactNode;
}
const InputNumberPro: React.FC<InputNumberProProps> = props => {
  return (
    <Fragment>
      {props.addonBefore && <span className={styles.addon}>{props.addonBefore}</span>}
      <InputNumber {...props} />
      {props.addonAfter && <span className={styles.addon}>{props.addonAfter}</span>}
    </Fragment>
  );
};
export default InputNumberPro;
