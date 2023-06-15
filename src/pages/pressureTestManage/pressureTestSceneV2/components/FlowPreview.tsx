import React, { useState, useEffect, useCallback } from 'react';
import { Tooltip, Icon, Statistic } from 'antd';
import FixLineCharts from '../../pressureTestScene/components/FixLineCharts';
import StepCharts from '../../pressureTestScene/components/StepCharts';
import service from '../service';
import { FormPath, IForm } from '@formily/antd';
import { debounce } from 'lodash';

interface Props {
  targetTps: number; // 目标TPS
  duration: number; // 压测时长
  pressConfig: {
    rampUp?: number; // 递增时长
    steps?: number; // 递增层数
    type?: number; // 压力模式 并发或TPS模式
    threadNum?: number; // 最大并发
    mode?: number; //  施压模式: 固定压力值/线性递增/阶梯递增
  };
  checkValid: () => Promise<any>;
  afterCalculate?: (data: any) => void;
}

const FlowPreview: React.FC<Props> = (props) => {
  const [estimateFlow, setEstimateFlow] = useState();
  const {
    duration,
    targetTps = 3,
    pressConfig = {},
    checkValid,
    afterCalculate,
  } = props;

  /**
   * 计算阶梯递增数据
   */
  const handleStepChartsData = () => {
    const midData = [];
    for (
      let i = 0;
      i < pressConfig.steps;
      // tslint:disable-next-line:no-increment-decrement
      i++
    ) {
      midData.push([
        (pressConfig.rampUp / pressConfig.steps) * (i + 1),
        ((pressConfig.type === 0 ? pressConfig.threadNum : targetTps) /
          pressConfig.steps) *
          (i + 1),
      ]);
    }

    if (midData.length > 0) {
      return [[0, 0]]
        .concat(midData)
        .concat([
          [
            duration,
            pressConfig.type === 0 ? pressConfig.threadNum : targetTps,
          ],
        ]);
    }
  };

  // 获取流量预估
  const getEstimateFlow = useCallback(
    debounce(async (params) => {
      const {
        data: { success, data },
      } = await service.getEstimateFlow(params);
      if (success) {
        const result = data?.value;
        setEstimateFlow(result);
        if (typeof afterCalculate === 'function') {
          afterCalculate(result);
        }
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkValid()
      .then(() => {
        getEstimateFlow({
          concurrenceNum: pressConfig.threadNum,
          pressureTestTime: {
            time: duration,
            unit: 'm',
          },
          pressureType: pressConfig.type,
          pressureMode: pressConfig.mode,
          increasingTime: {
            time: pressConfig.rampUp,
            unit: 'm',
          },
          step: pressConfig.steps,
          pressureScene: 0,
        });
      })
      .catch(() => {
        setEstimateFlow(null);
      });
  }, [checkValid, duration, getEstimateFlow, pressConfig.mode, pressConfig.rampUp, pressConfig.steps, pressConfig.threadNum, pressConfig.type]);

  return (
    <div
      style={{
        border: '1px solid #E5F1F3',
        padding: '5px 20px',
        backgroundImage:
          'linear-gradient(118.93deg, #F1F8FA 2.61%, #F8FEFF 100%)',
        marginTop: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          并发数
          <Tooltip
            title="并发数是根据施压配置参数模拟的压力图与预计消耗流量，最终计费以实际施压情况为准"
            placement="right"
            trigger="click"
          >
            <Icon
              type="question-circle"
              style={{ marginLeft: 4, marginRight: 4 }}
            />
          </Tooltip>
        </div>
        {/* <span>预计消耗：</span>
        {estimateFlow ? (
          <span>
            <Statistic
              style={{
                display: 'inline-block',
              }}
              precision={2}
              suffix={
                <span
                  style={{
                    fontWeight: 'normal',
                    color: '#90959A',
                    fontSize: 12,
                  }}
                >
                  vum
                </span>
              }
              value={estimateFlow}
              valueStyle={{
                color: '#11BBD5',
                fontWeight: 700,
                fontSize: 24,
              }}
            />
          </span>
        ) : (
          '-- vum'
        )} */}
      </div>
      {/* 固定压力模式 */}
      {pressConfig.mode === 1 && (
        <FixLineCharts
          chartsInfo={[
            [
              0,
              // 并发模式下取并发数，否则取tps
              pressConfig.type === 0 ? pressConfig.threadNum : targetTps,
            ],
            [
              duration,
              pressConfig.type === 0 ? pressConfig.threadNum : targetTps,
            ],
          ]}
        />
      )}
      {/* 线性递增模式 */}
      {pressConfig.mode === 2 && (
        <FixLineCharts
          chartsInfo={[
            [0, 0],
            [
              pressConfig.rampUp,
              pressConfig.type === 0 ? pressConfig.threadNum : targetTps,
            ],
            [
              duration,
              pressConfig.type === 0 ? pressConfig.threadNum : targetTps,
            ],
          ]}
        />
      )}
      {/* 阶梯递增模式 */}
      {pressConfig.mode === 3 && (
        <StepCharts chartsInfo={handleStepChartsData()} />
      )}
    </div>
  );
};

export default FlowPreview;
