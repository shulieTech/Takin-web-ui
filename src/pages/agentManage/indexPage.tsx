/**
 * @author chuxu
 */
import { Button, Modal } from 'antd';
import { useCreateContext, useStateReducer } from 'racc';
import React, { Fragment, useEffect } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { MainPageLayout } from 'src/components/page-layout';
import { MapBtnAuthority } from 'src/utils/utils';
import StepInfo from '../appAccess/components/StepInfo';
import StepLineInfo from '../appAccess/components/StepLineInfo';
import AppAccessService from '../appAccess/service';
import AgentManageBottom from './components/AgentManageBottom';
import styles from './index.less';
import AgentManageService from './service';

interface Props {}
const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  agentManageList: null,
  agentDashboard: {} as any,
  searchInputValue: undefined,
  agentStatus: undefined, // agent状态
  probeStatus: undefined, // 探针状态
  loading: false,
  total: 0,
  visible: false,
  currentStep: 0,
  appList: [], // 应用列表
  appName: null, // 应用名称
  stepIsDisabled: true, // 下一步是否禁用
  showIndex: 0, // 显示第几个dot
  checkStatus: null, // 检测状态,0:ing,1:success,2:fail
  accessModal: false,
  agentVersionInfo: null, // 探针版本信息，初始列表第一个
  selectedRowKeys: undefined,
  downloadTime: null,
  allAppList: null
});
export const AgentManageContext = useCreateContext<AgentManageState>();
export type AgentManageState = ReturnType<typeof getInitState>;
const AgentManage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    queryAllAppList();
    queryVersionList({
      current: 0,
      pageSize: 10
    });
  }, [state.isReload]);

  /**
   * @name 获取探针版本列表
   */
  const queryVersionList = async value => {
    const {
      data: { success, data }
    } = await AppAccessService.queryVersionList({
      ...value
    });
    if (success) {
      setState({
        agentVersionInfo: data && data.length > 0 ? data[0] : null
      });
      return;
    }
  };

  /**
   * @name 获取所有应用
   */
  const queryAllAppList = async () => {
    const {
      data: { success, data }
    } = await AgentManageService.queryAllAppList({});
    if (success) {
      setState({
        allAppList:
          data &&
          data.map((item, k) => {
            return { label: item, value: item };
          })
      });
      return;
    }
  };
  return (
    <AgentManageContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <div className={styles.borders}>
          <CustomDetailHeader
            title="探针列表"
            img={
              <CustomIcon
                imgWidth={28}
                color="var(--BrandPrimary-500, #11D0C5)"
                imgName="redis_icon"
                iconWidth={64}
              />
            }
            description="探针管理说明"
            extra={
              <AuthorityBtn
                isShow={
                  MapBtnAuthority('appManage_appAccess_7_download') ||
                  MapBtnAuthority('appManage_appAccess_2_create')
                }
              >
                <div style={{ float: 'right' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setState({
                        visible: true
                      });
                    }}
                  >
                    新应用接入
                  </Button>
                </div>
              </AuthorityBtn>
            }
          />
        </div>

        <Modal
          maskClosable={false}
          width={720}
          title="新应用接入"
          visible={state.visible}
          footer={null}
          onCancel={() => {
            localStorage.removeItem('checkDate');
            setState({
              visible: false,
              downloadTime: null,
              checkStatus: null,
              currentStep: 0,
              appList: [], // 应用列表
              appName: null, // 应用名称
              stepIsDisabled: true, // 下一步是否禁用
              showIndex: 0, // 显示第几个dot
              selectedRowKeys: undefined
            });
          }}
        >
          <StepInfo state={state} setState={setState} />
        </Modal>
        <Modal
          maskClosable={false}
          title="接入说明"
          width={900}
          visible={state.accessModal}
          footer={null}
          onCancel={() => {
            setState({
              accessModal: false
            });
          }}
        >
          <div style={{ height: 500, overflow: 'auto' }}>
            <StepLineInfo />
          </div>
        </Modal>
        <AgentManageBottom />
      </MainPageLayout>
    </AgentManageContext.Provider>
  );
};
export default AgentManage;
