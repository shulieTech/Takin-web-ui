import React, { Fragment } from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import { Skeleton } from 'antd';
interface Props {}
const CustomSkeleton: React.FC<Props> = props => {
  return (
    <BasePageLayout>
      <Skeleton active />
    </BasePageLayout>
  );
};
export default CustomSkeleton;
