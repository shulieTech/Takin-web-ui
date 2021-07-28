import React, { Fragment } from 'react';
import styles from './index.less';
interface Props {
  title?: string | React.ReactNode;
  desc?: string | React.ReactNode;
  extra?: React.ReactNode;
}
const EmptyNode: React.FC<Props> = props => {
  const { title, desc, extra } = props;
  return (
    <div className={styles.emptyNodeWrap}>
      <div className={styles.circle} />
      <div className={styles.title}>{title ? title : '暂无数据'}</div>
      {desc && <p className={styles.desc}>{desc}</p>}
      <div>{extra}</div>
    </div>
  );
};
export default EmptyNode;
