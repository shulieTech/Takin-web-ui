/**
 * @author chuxu
 */
import { Button, Col, Dropdown, Menu, Row, Upload } from 'antd';
import { ImportFile, useCreateContext, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { MainPageLayout } from 'src/components/page-layout';
import BusinessFlowBottom from './components/BusinessFlowBottom';

import styles from './index.less';

interface Props {}
const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },

  searchInputValue: null,
  status: undefined,
  loading: false,
  total: 0,
  businessFlowList: [{ a: 1 }]
});
export const BusinessFlowContext = useCreateContext<BusinessFlowState>();
export type BusinessFlowState = ReturnType<typeof getInitState>;
const BusinessFlow: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());

  const menu = (
    <Menu>
      <Menu.Item>
        <a>手工新增</a>
      </Menu.Item>
      <Menu.Item>
        <a>Jmeter扫描新增</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <BusinessFlowContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <div className={styles.borders}>
          <CustomDetailHeader
            title="业务流程"
            img={
              <CustomIcon
                imgWidth={28}
                color="#11D0C5"
                imgName="redis_icon"
                iconWidth={64}
              />
            }
            extra={
              <div style={{ float: 'right' }}>
                <Dropdown overlay={menu} placement="bottomLeft">
                  <Button type="primary">新增</Button>
                </Dropdown>
              </div>}
          />
        </div>
        <BusinessFlowBottom />
      </MainPageLayout>
    </BusinessFlowContext.Provider>
  );
};
export default BusinessFlow;
