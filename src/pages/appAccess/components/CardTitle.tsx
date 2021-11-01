import React, { Fragment } from 'react';
import styles from './../index.less';
interface Props {
  title: string | React.ReactNode;
  describe?: string | React.ReactNode;
}
const CardTitle: React.FC<Props> = props => {
  return (
    <div className={styles.cardTitleWrap}>
      <span className={styles.title}>{props.title}</span>
      <span className={styles.describe}>{props.describe}</span>
    </div>
  );
};
export default CardTitle;
