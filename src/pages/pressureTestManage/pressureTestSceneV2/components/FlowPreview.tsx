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
}

const FlowPreview: React.FC<Props> = (props) => {
  const [estimateFlow, setEstimateFlow] = useState();
  const { duration, targetTps = 3, pressConfig = {} } = props;

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

  // // 获取流量预估
  // const getEstimateFlow = useCallback(
  //   debounce(async (params) => {
  //     const {
  //       data: { success, data },
  //     } = await service.getEstimateFlow(params);
  //     if (success) {
  //       const result = data?.value;
  //       setEstimateFlow(result);
  //       form.setFieldValue(parentPath.concat('.estimateFlow'), result);
  //     }
  //   }, 500),
  //   []
  // );

  // const { estimateFlow: aaa, ...restPressConfig } = pressConfig;

  // useEffect(() => {
  //   Promise.all([
  //     form.validate('.config.duration'),
  //     form.validate(parentPath.concat('.threadNum')),
  //     form.validate(parentPath.concat('.duration')),
  //     form.validate(parentPath.concat('.type')),
  //     form.validate(parentPath.concat('.mode')),
  //     form.validate(parentPath.concat('.rampUp')),
  //     form.validate(parentPath.concat('.steps')),
  //   ])
  //     .then((res) => {
  //       getEstimateFlow({
  //         concurrenceNum: pressConfig.threadNum,
  //         pressureTestTime: {
  //           time: formValue?.config.duration,
  //           unit: 'm',
  //         },
  //         pressureType: pressConfig.type,
  //         pressureMode: pressConfig.mode,
  //         increasingTime: {
  //           time: pressConfig.rampUp,
  //           unit: 'm',
  //         },
  //         step: pressConfig.steps,
  //         pressureScene: 0,
  //       });
  //     })
  //     .catch(() => {
  //       setEstimateFlow(null);
  //     });
  // }, [formValue?.config?.duration, ...Object.values(restPressConfig)]);

  return (
    <div
      style={{
        border: '1px dashed #979797',
        padding: '5px 20px',
        backgroundColor: '#fafbfd',
        marginTop: 8,
      }}
    >
      <div>
        流量预估
        <Tooltip
          title="流量预估是根据施压配置参数模拟的压力图与预计消耗流量，最终计费以实际施压情况为准"
          placement="right"
          trigger="click"
        >
          <Icon
            type="question-circle"
            style={{ marginLeft: 4, marginRight: 4 }}
          />
        </Tooltip>
        <span>预计消耗：</span>
        {estimateFlow ? (
          <span>
            <Statistic
              style={{ display: 'inline-block' }}
              precision={2}
              suffix="vum"
              value={estimateFlow}
            />
          </span>
        ) : (
          '-- vum'
        )}
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
