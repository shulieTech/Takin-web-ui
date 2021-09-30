/**
 * @name chuxu
 */
import React, { Fragment } from 'react';
import { Descriptions } from 'antd';
import styles from './index.less';
interface Props {
  dataSource: {
    label: string | React.ReactNode;
    value: string | React.ReactNode;
  }[];
  title: string | React.ReactNode;
}
const CustomDescriptions: React.FC<Props> = props => {
  return (
    <div className={styles.bg}>
      <Descriptions title={props.title}>
        {props.dataSource &&
          props.dataSource.map((item, k) => {
            return (
              <Descriptions.Item key={k} label={item.label}>
                {item.value}
              </Descriptions.Item>
            );
          })}
      </Descriptions>
    </div>
  );
};
export default CustomDescriptions;
