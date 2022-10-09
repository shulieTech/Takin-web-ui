import React, { useState, useEffect, useContext, Fragment } from 'react';
import {
  Icon,
  Alert,
  Divider,
  Modal,
  message,
  Dropdown,
  Menu,
  Button,
} from 'antd';
import { PrepareContext } from '../_layout';
import AppCheck from './AppCheck';
import DataIsloate from './DataIsloate';
import RemoteImport from './RemoteCall';
import ProgressListModal from '../modals/ProgressList';
import Help from './Help';
import styles from '../index.less';
import service from '../service';
import { STEP_STATUS } from '../constants';
import SyncLinkModal from '../modals/SyncLink';
import { Link } from 'umi';
// import AddJmeterModal from 'src/pages/businessFlow/modals/AddJmeterModal';
import ShadowConsumer from './ShadowConsumer';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const [step, setStep] = useState(0);
  const [stepStatus, setStepStatus] = useState({
    APP: 0,
    DS: 0,
    REMOTECALL: 0,
    SHADOW_CONSUMER: 0,
  });
  const [showProgressListModal, setShowProgressListModal] = useState(false);
  const [showSyncLinkModal, setShowSyncLinkModal] = useState(false);
  // const [flowDetail, setFlowDetail] = useState<any>();

  const commonStepStyle = {
    display: 'flex',
    // minWidth: 132,
    padding: 4,
    paddingRight: 16,
    borderRadius: 100,
    cursor: 'pointer',
    // border: '1px solid var(--BrandPrimary-500, #11bbd5)',
    // backgroundColor: '#F2FDFF',
  };
  const activeStepStyle = {
    color: '#fff',
    backgroundColor: 'var(--BrandPrimary-500, #11bbd5)',
    boxShadow:
      '0px 8px 24px rgba(136, 136, 136, 0.1), 0px 6px 14px rgba(136, 136, 136, 0.3)',
  };

  const stepList = [
    {
      title: '应用检查',
      statusName: stepStatus.APP,
    },
    {
      title: '影子隔离',
      statusName: stepStatus.DS,
    },
    {
      title: '远程调用',
      statusName: stepStatus.REMOTECALL,
    },
    {
      title: '影子消费者',
      statusName: stepStatus.SHADOW_CONSUMER,
    },
  ];

  const getStepStatus = async (id) => {
    const {
      data: { success, data },
    } = await service.stepStatus({
      id,
    });
    if (success) {
      setStepStatus(data);
    }
  };

  const deleteLink = () => {
    Modal.confirm({
      title: '提示',
      content: '确定删除该链路？',
      onOk: async () => {
        const {
          data: { success, data },
        } = await service.deleteLink({
          id: prepareState.currentLink?.id,
        });
        if (success) {
          message.success('操作成功');
          setPrepareState({
            refreshListKey: prepareState.refreshListKey + 1,
          });
        }
      },
    });
  };

  // 获取关联业务流程的详情
  // const getFlowDetail = async () => {
  //   const {
  //     data: { data, success },
  //     // TODO 获取业务流程的id
  //   } = await service.getFlowDetail({ id: 289 });
  //   if (success) {
  //     setFlowDetail(data);
  //   }
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (prepareState.currentLink?.id) {
        getStepStatus(prepareState.currentLink?.id);
        // getFlowDetail();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [prepareState.currentLink?.id, prepareState.stepStatusRefreshKey]);

  useEffect(() => {
    setStep(0);
  }, [prepareState.currentLink?.id]);

  return (
    <div
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      className={styles['detail-box']}
    >
      <div
        style={{
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #F7F8FA',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {/* <div
            style={{
              background: 'var(--Netural-75, #F7F8FA)',
              textAlign: 'center',
              padding: '4px 16px',
              border: '1px solid var(--Netural-200, #E5E8EC)',
              borderRadius: 8,
              textDecorationLine: 'underline',
              color: 'var(--Netural-850, #414548)',
              cursor: 'pointer',
            }}
            onClick={() => setShowProgressListModal(true)}
          >
            进度
            <br />
            清单
          </div>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} /> */}
          {stepList.map((x, i, arr) => {
            return (
              <Fragment key={x.title}>
                <div
                  style={{
                    ...commonStepStyle,
                    ...(step === i ? activeStepStyle : {}),
                  }}
                  onClick={() => setStep(i)}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color:
                        step === i ? '#fff' : 'var(--Netural-850, #414548)',
                      marginRight: 8,
                      width: 40,
                      height: 40,
                      border: `1px solid ${
                        step === i ? '#fff' : 'var(--Netural-300, #DBDFE3)'
                      }`,
                      borderRadius: '100%',
                      lineHeight: '38px',
                      textAlign: 'center',
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          step === i ? '#fff' : 'var(--Netural-850, #414548)',
                      }}
                    >
                      {x.title}
                    </span>
                    <div style={{ fontSize: 12, marginTop: 4 }}>
                      {STEP_STATUS[x.statusName] || '未开始'}
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <Icon
                    type="right"
                    style={{
                      margin: '0 12px',
                      color: 'var(--Netural-400, #BFC3C8)',
                    }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* {flowDetail && (
            <AddJmeterModal
              btnText="管理脚本"
              action="edit"
              fileList={flowDetail?.scriptFile}
              detailData={flowDetail}
              id={flowDetail?.id}
              jumpToDetailOnSuccess={false}
              onSuccess={() => {
                //
              }}
              resetModalProps={{ btnProps: { type: 'default' } }}
            />
          )} */}
          <Link to={`/prepareShadowSource/sub/flow?id=288`}>
            <Button style={{ marginLeft: 24 }}>管理脚本</Button>
          </Link>
          <Link to={`/prepareShadowSource/sub/activity?id=45`}>
            <Button style={{ marginLeft: 24 }}>链路拓扑</Button>
          </Link>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Button
                    type="link"
                    block
                    onClick={() => setShowSyncLinkModal(true)}
                    style={{ padding: '0 32px' }}
                  >
                    同步配置
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    type="link"
                    block
                    onClick={() => {
                      setPrepareState({
                        editLink: prepareState.currentLink,
                      });
                    }}
                    style={{ padding: '0 32px' }}
                  >
                    编辑链路
                  </Button>
                </Menu.Item>
                {prepareState.currentLink.type === 0 && (
                  <Menu.Item>
                    <Button
                      type="link"
                      block
                      style={{
                        padding: '0 32px',
                        color: 'var(--FunctionNegative-500, #D24D40)',
                      }}
                      onClick={deleteLink}
                    >
                      删除链路
                    </Button>
                  </Menu.Item>
                )}
              </Menu>
            }
          >
            <Button style={{ width: 32, padding: 0, marginLeft: 24 }}>
              <Icon type="more" />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {prepareState.alertInfo && (
          <Alert
            style={{
              backgroundColor: 'var(--Netural-75, #F7F8FA)',
              color: 'var(--Netural-800, #5A5E62)',
              border: '1px solid var(--Netural-200, #E5E8EC)',
              margin: '16px 32px',
            }}
            closable
            message={prepareState.alertInfo}
          />
        )}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            paddingBottom: 16,
            position: 'relative',
          }}
        >
          {step === 0 && <AppCheck />}
          {step === 1 && <DataIsloate />}
          {step === 2 && <RemoteImport />}
          {step === 3 && <ShadowConsumer />}
        </div>
      </div>

      <Help />
      {showProgressListModal && (
        <ProgressListModal
          cancelCallback={() => setShowProgressListModal(false)}
        />
      )}
      {showSyncLinkModal && (
        <SyncLinkModal
          detail={prepareState.currentLink}
          okCallback={() => setShowSyncLinkModal(false)}
          cancelCallback={() => setShowSyncLinkModal(false)}
        />
      )}
    </div>
  );
};
