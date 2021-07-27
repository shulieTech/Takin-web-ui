import React, { Fragment } from 'react';
import { StatisticProps } from 'antd/lib/statistic/Statistic';
import { Statistic } from 'antd';
import styles from './index.less';
interface Props extends StatisticProps {}
const CustomStatistic: React.FC<Props> = props => {
  return (
    <div className={styles.statisticWrap}>
      <Statistic {...props} />
    </div>
  );
};
export default CustomStatistic;
