import React, { useState, useEffect } from 'react';
import { Tooltip, Icon, Statistic } from 'antd';
import FixLineCharts from '../../pressureTestScene/components/FixLineCharts';
import StepCharts from '../../pressureTestScene/components/StepCharts';

export default (props) => {
  const { formValue, xpathMd5 } = props;
  const [estimateFlow, setEstimateFlow] = useState();

  const targetConfig = formValue?.goal?.[xpathMd5] || { tps: 3 }; // 压测目标
  const pressConfig = formValue?.config?.threadGroupConfigMap?.[xpathMd5] || {}; // 施压配置

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
        ((pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps) /
          pressConfig.steps) *
          (i + 1),
      ]);
    }

    if (midData.length > 0) {
      return [[0, 0]]
        .concat(midData)
        .concat([
          [
            formValue?.config.duration,
            pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps,
          ],
        ]);
    }
  };

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
            <Statistic precision={2} suffix="vum" value={estimateFlow} />
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
              pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps,
            ],
            [
              formValue?.config.duration,
              pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps,
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
              pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps,
            ],
            [
              formValue?.config.duration,
              pressConfig.type === 0 ? pressConfig.threadNum : targetConfig.tps,
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
