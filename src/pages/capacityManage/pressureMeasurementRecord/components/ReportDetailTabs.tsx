import React, { Fragment } from 'react';
import { Tabs } from 'antd';

import styles from './../index.less';
import DetailTabs from 'src/common/detail-tabs';

interface Props {
  detailData?: any;
  extCode?: string;
}
const ReportDetailTabs: React.FC<Props> = props => {
  const { detailData, extCode } = props;

  const tabsData = [
    {
      title: '整体情况',
      tabNode: <div>1</div>
    },
    {
      title: '业务性能',
      tabNode: <div>2</div>
    },
    {
      title: '机器性能',
      tabNode: <div>3</div>
    },
    {
      title: '压测复盘',
      tabNode: <div>4</div>
    },
    {
      title: '优化策略',
      tabNode: <div>5</div>
    },
    {
      title: '性能趋势',
      tabNode: <div>6</div>
    }
  ];

  return (
    <DetailTabs>
      {tabsData.map((item, index) => {
        return (
          <Tabs.TabPane tab={item.title} key={`${index}`}>
            {item.tabNode}
          </Tabs.TabPane>
        );
      })}
    </DetailTabs>
  );
};
export default ReportDetailTabs;
