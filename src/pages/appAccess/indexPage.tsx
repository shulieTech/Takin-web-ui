/**
 * @author chuxu
 */
import React, { Fragment, useEffect } from 'react';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import { MainPageLayout } from 'src/components/page-layout';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { useCreateContext, useStateReducer } from 'racc';
import commonsStyles from './../../custom.less';
import { Button, Modal } from 'antd';
import styles from './index.less';
import StepInfo from './components/StepInfo';
import StepByStepInstructions from './components/StepByStepInstructions';
import StepLineInfo from './components/StepLineInfo';
import AppAccessService from './service';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { MapBtnAuthority } from 'src/utils/utils';

const getInitState = () => ({
  isReload: false,
  visible: false, // modal展示
  currentStep: 0,
  appList: [], // 应用列表
  appName: null, // 应用名称
  stepIsDisabled: true, // 下一步是否禁用
  showIndex: 0, // 显示第几个dot
  checkStatus: null, // 检测状态,0:ing,1:success,2:fail
  accessModal: false,
  agentVersionInfo: null, // 探针版本信息，初始列表第一个
  selectedRowKeys: undefined,
  downloadTime: null
});
export const AppAccessContext = useCreateContext<AppAccessState>();
export type AppAccessState = ReturnType<typeof getInitState>;
interface Props {}
const AppAccess: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());
  useEffect(() => {
    queryVersionList({
      current: 0,
      pageSize: 10
    });
  }, [state.visible]);

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
  return (
    <AppAccessContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <div className={commonsStyles.listHeaderBorders}>
          <CustomDetailHeader
            title="新应用接入"
            img={
              <CustomIcon
                imgWidth={28}
                color="var(--BrandPrimary-500)"
                imgName="app_access_icon"
                iconWidth={64}
              />
            }
            description="接入说明描述"
          />
        </div>
        <div className={styles.addWrap}>
          <img width={280} src={require('./../../assets/add_app_img.png')} />
          <p className={styles.title}>接入新应用</p>
          <AuthorityBtn
            isShow={
              MapBtnAuthority('appManage_appAccess_7_download') ||
              MapBtnAuthority('appManage_appAccess_2_create')
            }
          >
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                setState({
                  visible: true
                });
              }}
            >
              接入您的应用
            </Button>
          </AuthorityBtn>
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
        <StepByStepInstructions />
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
          <div style={{ height: 500, overflow: 'scroll' }}>
            <StepLineInfo />
          </div>
        </Modal>
      </MainPageLayout>
    </AppAccessContext.Provider>
  );
};
export default AppAccess;
