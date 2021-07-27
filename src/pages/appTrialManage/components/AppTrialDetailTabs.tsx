import React, { Fragment } from 'react';
import { Tabs } from 'antd';

import styles from './../index.less';
import DetailTabs from 'src/common/detail-tabs';
import MiddleWareTable from './MiddleWareTable';
import PtTable from './PtTable';

interface Props {
  detailData?: any;
  id?: string;
}
const AppTrialDetailTabs: React.FC<Props> = props => {
  const { detailData, id } = props;

  const tabsData = [
    {
      title: '中间件列表',
      tabNode: <MiddleWareTable id={id} detailData={detailData} />
    },
    {
      title: '影子表',
      tabNode: <PtTable id={id} detailData={detailData} />
    }
  ];

  return (
    <DetailTabs defaultActiveKey="0">
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
export default AppTrialDetailTabs;
