import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Icon } from 'antd';
import services from '../service';
import { router } from 'umi';

interface Props {
  startedScence: any;
  visible: boolean;
  onCancel: () => void;
}

const StartStatusModal: React.FC<Props> = (props) => {
  const STATUS_MAP = {
    0: 'error',
    1: 'finish',
    2: 'wait',
  };
  const { startedScence, visible, onCancel, ...restProps } = props;
  const {
    triggerTime,
    scenceInfo = {},
    ...restStartScenceInfo
  } = startedScence;
  const [cancelStarting, setCancelStarting] = useState(false);
  const defaultStepInfo = {
    resourceId: undefined,
    status: 2,
    podNumber: 0,
    checkList: [
      {
        status: 2,
      },
    ],
  };
  const [currentStepInfo, setCurrentStepInfo] = useState(defaultStepInfo);

  const stepList = [
    {
      type: 'file',
      title: '检测脚本是否完整',
    },
    {
      type: 'flow',
      title: '检测流量是否充足',
    },
    {
      type: 'application',
      title: '检测应用状态',
    },
    {
      type: 'env',
      title: '检测压力机环境',
    },
    {
      type: 'resource',
      title: '检测压力机资源是否充足',
    },
    {
      type: 'start',
      title: '启动压测',
    },
  ];

  const startScenceAfterChcek = async () => {
    const {
      data: { success, data },
    } = await services.startPressureTestScene({
      sceneId: scenceInfo.id,
      ...restStartScenceInfo,
    });
    if (success) {
      message.success('开启压测场景成功！');
      onCancel();
      router.push(
        `/pressureTestManage/pressureTestReport/pressureTestLive?id=${scenceInfo.id}`
      );
    }
  };

  let timer;

  const getCurrentStepInfo = async (resourceId = currentStepInfo.resourceId) => {
    const {
      data: { success, data },
    } = await services.scenceStartPreCheck({
      resourceId,
      sceneId: scenceInfo.id,
    });
    if (success) {
      setCurrentStepInfo(data);

      const isAllSuccess = data.status === 1;

      if (isAllSuccess) {
        startScenceAfterChcek();
        return;
      }

      // 没有失败或者全部成功的情况下，轮询
      if (!(data.status === 0 || isAllSuccess)) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => getCurrentStepInfo(data.resourceId), 2000);
      }
    }
  };

  const cancelStart = async () => {
    if ([0].includes(currentStepInfo.status)) {
      onCancel();
      setCurrentStepInfo(defaultStepInfo);
    } else {
      setCancelStarting(true);
      // 取消启动中的场景
      const {
        data: { success },
      } = await services
        .scencePreStop({
          sceneId: scenceInfo.id,
        })
        .finally(() => {
          setCancelStarting(false);
        });
      if (success) {
        message.success('操作成功');
        onCancel();
        setCurrentStepInfo(defaultStepInfo);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      getCurrentStepInfo();
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [visible]);

  let currentStepIndex = 0;

  return (
    <Modal
      width={640}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      footer={null}
      closable={false}
      {...restProps}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span
            className="iconfont icon-Logo"
            style={{
              fontSize: 48,
              color: '#303336',
            }}
          />
        </div>
        <Button type="danger" loading={cancelStarting} onClick={cancelStart}>
          取消压测
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          padding: '40px 20px 40px 0',
          marginBottom: 20,
          borderBottom: '1px solid var(--Netural-100, #EEF0F2)',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              color: 'var(--Netural-850, #414548)',
              fontSize: 24,
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {scenceInfo.sceneName || '-'}
          </div>
          <div style={{ color: 'var(--Netural-700, #6F7479)', marginTop: 8 }}>
            压测启动开始时间：{triggerTime}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'var(--Netural-700, #6F7479)' }}>
            指定压力机个数
          </div>
          <div
            style={{
              color: 'var(--Netural-850, #414548)',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            {currentStepInfo.podNumber || '-'}
          </div>
        </div>
      </div>
      <div
        style={{
          marginBottom: 20,
        }}
      >
        {stepList.map((item, index, arr) => {
          let icon = (
            <span
              style={{
                width: 20,
                height: 20,
                lineHeight: '18px',
                fontSize: 12,
                textAlign: 'center',
                borderRadius: '100%',
                color: 'var(--Netural-850, #414548)',
                border: '1px solid currentColor',
              }}
            >
              {index + 1}
            </span>
          );
          switch (true) {
            // 失败
            case currentStepInfo.checkList[index]?.status === 0:
              icon = (
                <Icon
                  type="close"
                  style={{
                    fontSize: 20,
                    color: 'var(--FunctionNegative-500, #D24D40)',
                  }}
                />
              );
              break;
            // running
            case currentStepInfo.checkList[index]?.status === 2 &&
              currentStepIndex === index:
              icon = (
                <Icon
                  type="loading"
                  style={{ fontSize: 20, color: '#11BBD5' }}
                />
              );
              break;
            // 成功
            case currentStepInfo.checkList[index]?.status === 1:
              icon = (
                <Icon type="check" style={{ fontSize: 20, color: '#11BBD5' }} />
              );
              currentStepIndex = index + 1;
              break;
            default:
              break;
          }
          const isErrorStep = currentStepInfo.checkList[index]?.status === 0;
          return (
            <div
              key={item.title}
              style={{
                display: 'flex',
                alignItems: 'top',
                padding: 16,
                borderRadius: 4,
                borderBottom:
                  index === arr.length - 1
                    ? ''
                    : '1px solid var(--Netural-75, #F7F8FA)',
                backgroundColor: isErrorStep
                  ? 'var(--FunctionNegative-50, #FAF2F3)'
                  : 'inherit',
              }}
            >
              {icon}
              <div style={{ fontSize: 16, marginLeft: 32 }}>
                <div
                  style={{
                    color: isErrorStep
                      ? 'var(--FunctionNegative-500, #D24D40)'
                      : 'inherit',
                  }}
                >
                  {item.title}
                </div>
                {isErrorStep && currentStepInfo.checkList[index]?.message && (
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--Netural-850, #414548)',
                      marginTop: 16,
                    }}
                  >
                    {currentStepInfo.checkList[index]?.message}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default StartStatusModal;
