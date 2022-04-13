import React, { useState, useEffect } from 'react';
import ServiceCustomTable from 'src/components/service-custom-table';
import { Steps, Collapse, Tag, Modal, Button, Icon, Divider } from 'antd';
import services from '../service';

interface Props {
  reportInfo: {
    scenceId: string | number;
    reportId: string | number;
  };
  ticker?: number;
}
enum StepStatus {
  WAIT,
  RUNING,
  SUCCESS,
  FAILED,
}

const { Step } = Steps;

export const PressureMachineTable: React.FC<Props> = (props) => {
  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) => {
        return {
          1: <Tag color="#019E6F">Running</Tag>,
          2: <Tag color="#019E6F">Running</Tag>,
        }[text];
      },
    },
    {
      title: '压力机名称',
      dataIndex: 'machineName',
    },
    {
      title: 'Pod IP',
      dataIndex: 'podIp',
    },
    {
      title: 'Host IP',
      dataIndex: 'hostIp',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
  ];
  return (
    <ServiceCustomTable
      isQueryOnMount={false}
      // TODO 换成正确的接口
      service={services.queryLiveBusinessActivity}
      defaultQuery={props.reportInfo}
      columns={columns}
    />
  );
};

const PressTestSteps: React.FC<Props> = (props) => {
  const { reportInfo, ticker } = props;
  const [expaned, setExpaned] = useState(false);
  const [stepListInfo, setStepListInfo] = useState({
    allMachineCount: 0,
    startedMachineCount: 0,
    stopedMachineCount: 0,
    stepList: [
      { status: StepStatus.SUCCESS },
      { status: StepStatus.SUCCESS },
      { status: StepStatus.SUCCESS, message: '' },
      { status: StepStatus.SUCCESS },
    ],
  });

  const getStepListInfo = async () => {
    const {
      data: { data, success },
      // TODO 换成正确的接口
    } = await services.queryLiveBusinessActivity({
      scenceId: reportInfo.scenceId,
      reportId: reportInfo.reportId,
    });
    if (success) {
      setStepListInfo(data);
    }
  };

  useEffect(() => {
    getStepListInfo();
  }, [ticker]);

  const loadingIcon = (
    <Icon
      type="loading"
      style={{ marginRight: 8, color: '#11BBD5', fontSize: 18 }}
    />
  );
  const errorIcon = (
    <Icon type="warning" style={{ marginRight: 8, fontSize: 18 }} />
  );
  const stepList = [
    {
      titleMap: {
        0: '检测',
        1: <>{loadingIcon}检测中...</>,
        2: '检测完成',
        3: '检测失败',
      },
    },
    {
      titleMap: {
        0: '压测',
        1: <>{loadingIcon}压测启动中...</>,
        2: '压测完成',
        3: '压测失败',
      },
    },
    {
      titleMap: {
        0: '压测停止',
        1: <>{loadingIcon}压测停止中...</>,
        2: '压测停止完成',
        3: '压测停止失败',
      },
    },
    {
      titleMap: {
        0: '输出压测报告',
        1: <>{loadingIcon}输出压测报告...</>,
        2: '输出压测报告完成',
        3: '输出压测报告失败',
      },
      descriptionMap: {
        1: '过程大概耗时2min，请耐心等待',
      },
    },
  ];

  return (
    <Collapse
      activeKey={expaned ? '1' : undefined}
      expandIcon={() => null}
      bordered={false}
      style={{ marginBottom: 16, background: '#fff' }}
    >
      <Collapse.Panel
        key="1"
        showArrow={false}
        header={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 8,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 200,
                backgroundColor: 'var(--Netural-75, #F7F8FA)',
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  color: '#393B4F',
                  fontWeight: 600,
                }}
              >
                压力机实况
              </div>
              <div
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  marginTop: 8,
                }}
              >
                正常
              </div>
            </div>
            <Steps
              size="small"
              labelPlacement="vertical"
              style={{ flex: 1, padding: '0 100px' }}
            >
              {stepList.map((item, index) => {
                const { status = StepStatus.WAIT, message } =
                  stepListInfo?.stepList?.[index] || {};

                const descriptionStr = message || item.descriptionMap?.[status];
                return (
                  <Step
                    key={index}
                    title={
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.titleMap[status]}
                      </div>
                    }
                    status={
                      {
                        0: 'wait',
                        1: 'process',
                        2: 'finish',
                        3: 'error',
                      }[status]
                    }
                    description={
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          width: 'max-content',
                          transform: 'translateX(calc(-50% + 58px))',
                        }}
                      >
                        {status === StepStatus.FAILED && errorIcon}
                        {descriptionStr}
                      </div>
                    }
                  />
                );
              })}
            </Steps>
            <a
              style={{
                alignSelf: 'flex-start',
              }}
              onClick={() => {
                setExpaned(!expaned);
              }}
            >
              展开明细
              <Icon
                type={'down'}
                style={{
                  marginLeft: 8,
                }}
              />
            </a>
          </div>
        }
      >
        <Divider />
        <div>
          <span style={{ marginRight: 40 }}>
            <span
              style={{
                color: 'var(--Netural-700, #6F7479)',
                marginRight: 16,
              }}
            >
              指定压力机数
            </span>
            <span
              style={{
                color: 'var(--Netural-850, #414548)',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {stepListInfo.allMachineCount || 0}
            </span>
          </span>
          {stepListInfo.startedMachineCount > 0 && (
            <span style={{ marginRight: 40 }}>
              <span
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  marginRight: 16,
                }}
              >
                已启动
              </span>
              <span
                style={{
                  color: 'var(--Netural-850, #414548)',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {stepListInfo.startedMachineCount}
              </span>
            </span>
          )}
          {stepListInfo.stopedMachineCount > 0 && (
            <span style={{ marginRight: 40 }}>
              <span
                style={{
                  color: 'var(--Netural-700, #6F7479)',
                  marginRight: 16,
                }}
              >
                已停止
              </span>
              <span
                style={{
                  color: 'var(--Netural-850, #414548)',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                {stepListInfo.stopedMachineCount}
              </span>
            </span>
          )}
        </div>
        <PressureMachineTable reportInfo={reportInfo} />
      </Collapse.Panel>
    </Collapse>
  );
};
export default PressTestSteps;
