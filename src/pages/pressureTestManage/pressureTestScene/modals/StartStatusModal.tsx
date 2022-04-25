import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Icon } from 'antd';
import services from '../service';
import { router } from 'umi';

interface Props {
  scenceInfo: any;
  visible: boolean;
  onCancel: () => void;
}

enum STEP_STATUS {
  WAITING,
  RUNNING,
  SUCCESS,
  FAILED,
}

const StartStatusModal: React.FC<Props> = (props) => {
  const { scenceInfo, visible, onCancel, ...restProps } = props;
  const [cancelStarting, setCancelStarting] = useState(false);
  const [currentStepInfo, setCurrentStepInfo] = useState({
    index: 2,
    status: STEP_STATUS.FAILED,
    message: '你的流量余额 689 VUM，流量余额不足，请充值后继续压测',
  });

  const stepList = [
    {
      title: '检测脚本是否完整',
    },
    {
      title: '检测流量是否充足',
    },
    {
      title: '检测应用环境是否正常',
    },
    {
      title: '检测压力机环境',
    },
    {
      title: '检测压力机资源是否充足',
    },
  ];

  let timer;

  const getCurrentStepInfo = async () => {
    // TODO 更换为正常的接口
    const {
      data: { success, data },
    } = await services.addPressureTestScene({
      scenceId: scenceInfo.sceneId,
    });
    if (success) {
      setCurrentStepInfo(data);

      const isAllSuccess =
        data.index === stepList.length - 1 &&
        data.status !== STEP_STATUS.SUCCESS;

      if (isAllSuccess) {
        message.success('开启压测场景成功！');
        onCancel();
        router.push(
          `/pressureTestManage/pressureTestReport/pressureTestLive?id=${scenceInfo.id}`
        );
      }

      // 没有失败或者全部成功的情况下，轮询
      if (!(data.status === STEP_STATUS.FAILED || isAllSuccess)) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(getCurrentStepInfo, 2000);
      }
    }
  };

  const cancelStart = async () => {
    if ([STEP_STATUS.FAILED].includes(currentStepInfo.status)) {
      onCancel();
    } else {
      setCancelStarting(true);
      // 取消启动中的场景
      const {
        data: { success },
      } = await services
        .scencePreStop({
          scenceId: scenceInfo.id,
        })
        .finally(() => {
          setCancelStarting(false);
        });
      if (success) {
        message.success('操作成功');
        onCancel();
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

  return (
    <Modal
      width={640}
      visible={visible}
      onCancel={onCancel}
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
            压测启动开始时间：2019-02-09 09:23:22
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
            {scenceInfo.threadNum || '-'}
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
                width: 24,
                lineHeight: '22px',
                fontSize: 14,
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
            case currentStepInfo.index === index &&
              currentStepInfo.status === STEP_STATUS.FAILED:
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
            case currentStepInfo.index === index:
              icon = (
                <Icon
                  type="loading"
                  style={{ fontSize: 20, color: '#11BBD5' }}
                />
              );
              break;
            case currentStepInfo.index > index:
              icon = (
                <Icon type="check" style={{ fontSize: 20, color: '#11BBD5' }} />
              );
              break;
            default:
              break;
          }
          const isErrorStep =
            currentStepInfo.index === index &&
            currentStepInfo.status === STEP_STATUS.FAILED;
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
                {isErrorStep && currentStepInfo.message && (
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--Netural-850, #414548)',
                      marginTop: 16,
                    }}
                  >
                    {currentStepInfo.message}
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
