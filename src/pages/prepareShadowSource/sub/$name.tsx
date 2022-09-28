import React from 'react';
import BusinessActivity from 'src/pages/businessActivity/detailsPage';
import BusinessFlow from 'src/pages/businessFlow/detailsPage';

export default (props) => {
  const { name } = props.match.params;
  const Comp =
    {
      activity: BusinessActivity, // 业务活动详情页
      flow: BusinessFlow, // 业务流程详情页
    }[name] || (() => <div>404</div>);
  return <Comp {...props} />;
};
