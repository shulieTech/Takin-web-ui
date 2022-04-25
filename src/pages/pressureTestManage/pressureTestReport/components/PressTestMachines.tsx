import React, { useState, useEffect, CSSProperties } from 'react';
import { CommonModal } from 'racc';
import CustomTable from 'src/components/custom-table';
import { Steps, Collapse, Tag, Icon, Divider, Tooltip, Pagination } from 'antd';
import services from '../service';
import styles from '../index.less';
import { getSortConfig, getTableSortQuery } from 'src/utils/utils';
import useListService from 'src/utils/useListService';
import { StepProps } from 'antd/lib/steps';

interface Props {
  reportInfo: {
    sceneId: string | number;
    reportId: string | number;
  };
  ticker?: number;
  isLive?: boolean;
}
enum StepStatus {
  INITIALIZED = 'INITIALIZED', // 初始化
  STARTING = 'STARTING', // 启动中
  ALIVE = 'ALIVE', // 启动完成
  PRESSURING = 'PRESSURING', // 压测中
  UNUSUAL = 'UNUSUAL', // 异常
  STOPPING = 'STOPPING', // 停止中
  INACTIVE = 'INACTIVE', // 停止
}

enum MachineStatus {
  WAIT,
  RUNING = 'Running',
  SUCCESS = 'Success',
  FAILED = 'Failed',
  STOPED = 'Stoped',
}

const { Step } = Steps;

const PressTestMachines: React.FC<Props> = (props) => {
  const { reportInfo, ticker, isLive = true } = props;

  const [expaned, setExpaned] = useState(false);
  const [stepListInfo, setStepListInfo] = useState({
    resourcesAmount: 0,
    aliveAmount: 0,
    inactiveAmount: 0,
    unusualAmount: 0,
    errorMessage: '',
  });

  const getStepList = (
    stepInfo
  ): { status: StepProps['status']; message?: string }[] => {
    return [
      {
        [StepStatus.INITIALIZED]: 'process',
        [StepStatus.STARTING]: 'finish',
        [StepStatus.ALIVE]: 'finish',
        [StepStatus.PRESSURING]: 'finish',
        [StepStatus.UNUSUAL]: 'finish',
        [StepStatus.STOPPING]: 'finish',
        [StepStatus.INACTIVE]: 'finish',
      }[stepInfo.status], // 检测
      {
        [StepStatus.STARTING]: 'process',
        [StepStatus.ALIVE]: 'finish',
        [StepStatus.PRESSURING]: 'finish',
        [StepStatus.UNUSUAL]: 'finish',
        [StepStatus.STOPPING]: 'finish',
        [StepStatus.INACTIVE]: 'finish',
      }[stepInfo.status], // 启动
      {
        status: {
          [StepStatus.PRESSURING]: 'process',
          [StepStatus.UNUSUAL]: 'error',
          [StepStatus.STOPPING]: stepInfo.errorMessage ? 'error' : 'finish',
          [StepStatus.INACTIVE]: stepInfo.errorMessage ? 'error' : 'finish',
        }[stepInfo.status],
        message: stepInfo.errorMessage,
      }, // 压测
      {
        status: {
          [StepStatus.STOPPING]: 'process',
          [StepStatus.INACTIVE]: 'finish',
        }[stepInfo.status],
      }, // 停止
      {
        [StepStatus.INACTIVE]: stepInfo.errorMessage ? 'wait' : 'process',
      }[stepInfo.status], // 报告
    ];
  };

  const {
    query,
    getList,
    list,
    total,
    loading: tableLoading,
  } = useListService({
    service: services.machineSummary,
    dataListPath: 'resources',
    isQueryOnMount: false,
    defaultQuery: {
      // ...reportInfo,
      resourceId: reportInfo.sceneId,
      taskId: reportInfo.reportId,
      current: 0,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        const tagStyle: CSSProperties = {
          border: 'none',
          width: 50,
          textAlign: 'center',
        };
        const tagEl = {
          [MachineStatus.RUNING]: (
            <Tag
              style={{
                color: '#019E6F',
                backgroundColor: '#EFFFF6',
                ...tagStyle,
              }}
            >
              进行中
            </Tag>
          ),
          [MachineStatus.FAILED]: (
            <Tag
              style={{
                color: '#D24D40',
                backgroundColor: '#FAF2F3',
                ...tagStyle,
              }}
            >
              异常
            </Tag>
          ),
          [MachineStatus.STOPED]: (
            <Tag
              style={{
                color: '#414548',
                backgroundColor: '#E5E8EC',
                ...tagStyle,
              }}
            >
              已停止
            </Tag>
          ),
        }[text];

        return (
          <>
            {tagEl}
            {record.status === MachineStatus.FAILED &&
              stepListInfo.errorMessage && (
                <>
                  <Divider type="vertical" />
                  <Icon
                    type="warning"
                    theme="filled"
                    style={{ color: 'var(--FunctionNegative-500, #D24D40)' }}
                  />
                  <Tooltip title={stepListInfo.errorMessage}>
                    <div
                      style={{
                        display: 'inline-block',
                        marginLeft: 8,
                        verticalAlign: 'middle',
                        maxWidth: 120,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {stepListInfo.errorMessage}
                    </div>
                  </Tooltip>
                </>
              )}
          </>
        );
      },
    },
    {
      title: '压力机名称',
      dataIndex: 'name',
    },
    // {
    //   title: '重启次数',
    //   dataIndex: 'restart',
    //   hide: isLive,
    // },
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
      dataIndex: 'startTime',
      ...(isLive ? {} : getSortConfig(query, 'startTime')),
    },
    {
      title: '停止时间',
      dataIndex: 'endTime',
      hide: isLive,
      ...(isLive ? {} : getSortConfig(query, 'endTime')),
    },
  ].filter((x) => !x.hide);

  const getStepListInfo = async () => {
    const {
      data: { success, data },
    } = await getList();
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
    <Icon
      type="warning"
      theme="filled"
      style={{ marginRight: 8, fontSize: 18 }}
    />
  );
  const stepList = [
    {
      titleMap: {
        wait: '检测',
        process: <>{loadingIcon}检测中...</>,
        finish: '检测完成',
        error: '检测失败',
      },
    },
    {
      titleMap: {
        wait: '压测',
        process: <>{loadingIcon}压测启动中...</>,
        finish: '压测完成',
        error: '压测失败',
      },
    },
    {
      titleMap: {
        wait: '压测停止',
        process: <>{loadingIcon}压测停止中...</>,
        finish: '压测停止完成',
        error: '压测停止失败',
      },
    },
    {
      titleMap: {
        wait: '输出压测报告',
        process: <>{loadingIcon}输出压测报告...</>,
        finish: '输出压测报告完成',
        error: '输出压测报告失败',
      },
      descriptionMap: {
        process: '过程大概耗时2min，请耐心等待',
      },
    },
  ];

  // 表格内容
  const tableEl = (
    <>
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
            {stepListInfo.resourcesAmount || 0}
          </span>
        </span>
        {stepListInfo.aliveAmount > 0 && (
          <span style={{ marginRight: 40 }}>
            <span
              style={{
                color: 'var(--Netural-700, #6F7479)',
                marginRight: 16,
              }}
            >
              运行中
            </span>
            <span
              style={{
                color: 'var(--Netural-850, #414548)',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {stepListInfo.aliveAmount}
            </span>
          </span>
        )}
        {stepListInfo.unusualAmount > 0 && (
          <span style={{ marginRight: 40 }}>
            <span
              style={{
                color: 'var(--Netural-700, #6F7479)',
                marginRight: 16,
              }}
            >
              异常
            </span>
            <span
              style={{
                color: 'var(--Netural-850, #414548)',
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              {stepListInfo.unusualAmount}
            </span>
          </span>
        )}
        {stepListInfo.inactiveAmount > 0 && (
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
              {stepListInfo.inactiveAmount}
            </span>
          </span>
        )}
      </div>
      <CustomTable
        dataSource={list}
        loading={tableLoading}
        onChange={(pagination, filters, sorter) => {
          getList(getTableSortQuery(sorter));
        }}
        columns={columns}
      />
      <Pagination
        style={{ marginTop: 20, textAlign: 'right' }}
        total={total}
        current={query.current + 1}
        pageSize={query.pageSize}
        showTotal={(t, range) =>
          `共 ${total} 条数据 第${query.current + 1}页 / 共 ${Math.ceil(
            total / (query.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) =>
          getList({ pageSize, current: current - 1 })
        }
        onShowSizeChange={(current, pageSize) =>
          getList({ pageSize, current: 0 })
        }
      />
    </>
  );

  return !isLive ? (
    <CommonModal
      modalProps={{
        width: '60vw',
        footer: null,
        bodyStyle: {
          maxHeight: '80vh',
          overflow: 'auto',
        },
      }}
      btnText="查看压力机明细"
      btnProps={{
        type: 'default',
        style: {
          marginRight: 8,
        },
      }}
    >
      {tableEl}
    </CommonModal>
  ) : (
    <Collapse
      activeKey={expaned ? '1' : undefined}
      expandIcon={() => null}
      bordered={false}
      className={styles['tight-collapse']}
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
                const { status = 'wait', message } =
                  getStepList(stepListInfo)?.[index] || {};

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
                    status={status}
                    description={
                      descriptionStr && (
                        <div
                          style={{
                            whiteSpace: 'nowrap',
                            width: 'max-content',
                            transform: 'translateX(calc(-50% + 58px))',
                          }}
                        >
                          {status === 'fail' ? (
                            <Tooltip title={descriptionStr}>
                              <span>{errorIcon} 异常</span>
                            </Tooltip>
                          ) : (
                            descriptionStr
                          )}
                        </div>
                      )
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
              {expaned ? '收起明细' : '展开明细'}
              <Icon
                type={expaned ? 'down' : 'right'}
                style={{
                  marginLeft: 8,
                }}
              />
            </a>
          </div>
        }
      >
        <Divider />
        {tableEl}
      </Collapse.Panel>
    </Collapse>
  );
};
export default PressTestMachines;
