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
import { Link } from 'umi';
import BusinessFlowBottom from './components/BusinessFlowBottom';

import styles from './index.less';
import AddJmeterModal from './modals/AddJmeterModal';

interface Props {}
const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },

  searchInputValue: null, // 搜索业务流程仅展示用
  businessFlowName: null, // 搜索业务流程关键词，仅接口用
  status: undefined,
  loading: false,
  total: 0,
  businessFlowList: null
});
export const BusinessFlowContext = useCreateContext<BusinessFlowState>();
export type BusinessFlowState = ReturnType<typeof getInitState>;
const BusinessFlow: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const menu = (
    <Menu>
      {/* <Menu.Item>
        <AuthorityBtn
          isShow={btnAuthority && btnAuthority.businessFlow_2_create}
        >
          <Link to="/businessFlow/addBusinessFlow?action=add">
            <Button type="link">手工新增</Button>
          </Link>
        </AuthorityBtn>
      </Menu.Item> */}
      <Menu.Item>
        <AddJmeterModal
          btnText="Jmeter 扫描新增"
          onSuccess={() => {
            setState({
              isReload: !state.isReload
            });
          }}
        />
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
                color="var(--BrandPrimary-500, #11D0C5)"
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
