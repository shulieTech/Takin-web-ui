import React, { Fragment } from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import { Button } from 'antd';
import EditKeyModal from './modals/EditKeyModal';
interface Props {}
const Demo: React.FC<Props> = props => {
  return (
    <Fragment>
      <BasePageLayout title="账号密钥">
        <p>
          密钥涉及压测平台数据准确性，请谨慎修改，若密钥遗忘或误修改请及时联系数列工作人员
        </p>
        <EditKeyModal btnText="修改密钥" />
      </BasePageLayout>
    </Fragment>
  );
};
export default Demo;
