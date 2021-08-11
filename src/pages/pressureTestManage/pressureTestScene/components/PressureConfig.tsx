/**
 * @name 步骤1-基本信息
 */

import { Icon, Input, InputNumber, Radio, Statistic, Tooltip } from 'antd';
import RadioGroup from 'antd/lib/radio/group';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect } from 'react';
import InputNumberPro from 'src/common/inputNumber-pro';
import { FormCardMultipleDataSourceBean } from 'src/components/form-card-multiple/type';
import { getTakinAuthority } from 'src/utils/utils';
import { PressureSource, TestMode } from '../enum';
import { PressureTestSceneConfigState } from '../pressureTestSceneConfigPage';
import PressureTestSceneService from '../service';
import styles from './../index.less';
import FixLineCharts from './FixLineCharts';
import StepCharts from './StepCharts';
import TimeInputWithUnit from './TimeInputWithUnit';

interface Props {}

const PressureConfig = (
  state: PressureTestSceneConfigState,
  setState,
  props
): FormCardMultipleDataSourceBean => {
  /** @name 施压配置 */
  const getPressureConfigFormData = (): FormDataType[] => {
    const { location } = props;
    const { query } = location;
    const { action } = query;

    const { detailData, pressureMode, testMode, pressureSource } = state;

    useEffect(() => {
      if (getTakinAuthority() === 'true') {
        // getEstimateFlow();
        // handleStepChartsData(state.stepIncreasingTime, state.pressureTestTime);
      }
    }, [
      state.pressureTestTime,
      state.concurrenceNum,
      state.pressureMode,
      state.lineIncreasingTime,
      state.stepIncreasingTime,
      state.step,
      state.testMode
    ]);

    const basicFormData: FormDataType[] = [
      {
        key: 'pressureType',
        label: (
          <span style={{ fontSize: 14 }}>
            压力模式
            <Tooltip
              title="自定义模式是指所有配置都读区jmeter脚本里面的参数"
              placement="right"
              trigger="click"
            >
              <Icon style={{ marginLeft: 4 }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue: action !== 'add' ? detailData.pressureType : testMode,
          rules: [{ required: true, message: '请选择压力模式' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <RadioGroup
            // onChange={e => handleChangeMode(e.target.value)}
            options={[
              { label: '并发模式', value: TestMode.并发模式 },
              { label: 'TPS模式', value: TestMode.TPS模式 }
              // { label: '自定义模式', value: TestMode.自定义模式 }
            ]}
          />
        )
      }
    ];

    const commonFormData: FormDataType[] = [
      {
        key: 'ipNum',
        label: (
          <span style={{ fontSize: 14 }}>
            指定Pod数
            <Tooltip
              title="指定压力机pod数量，可参考建议值范围。指定数量过高可能导致硬件资源无法支持；指定数量过低可能导致发起压力达不到要求"
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue: action !== 'add' ? detailData.ipNum : state.ipNum,
          rules: [{ required: true, message: '请输入指定Pod数' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <Input
            min={1}
            addonAfter={`建议Pod数：${
              !state.minIpNum ? '-' : `${state.minIpNum}-${state.maxIpNum}`
            }`}
            //   onBlur={handleCheckIsComplete}
          />
        ),
        extra: (
          <div
            className={styles.chartWrap}
            style={{ top: testMode === TestMode.并发模式 ? -60 : -40 }}
          >
            <p className={styles.title}>
              流量预估
              <Tooltip
                title="流量预估是根据施压配置参数模拟的压力图与预计消耗流量，最终计费以实际施压情况为准"
                placement="right"
                trigger="click"
              >
                <Icon type="question-circle" style={{ marginLeft: 4 }} />
              </Tooltip>
              <span className={styles.subTitle}>预计消耗：</span>
              {state.estimateFlow ? (
                <span className={styles.subTitleNum}>
                  <Statistic
                    precision={2}
                    suffix="vum"
                    value={state.estimateFlow}
                  />
                </span>
              ) : (
                '-- vum'
              )}
            </p>
            {true ? (
              <div>
                {state.pressureMode === 1 && (
                  <FixLineCharts
                    chartsInfo={[
                      [
                        0,
                        state.testMode === TestMode.并发模式
                          ? state.concurrenceNum
                          : state.tpsNum
                      ],
                      [
                        state.pressureTestTime && state.pressureTestTime.time,
                        state.testMode === TestMode.并发模式
                          ? state.concurrenceNum
                          : state.tpsNum
                      ]
                    ]}
                  />
                )}
                {state.pressureMode === 2 && (
                  <FixLineCharts
                    chartsInfo={[
                      [0, 0],
                      [
                        state.lineIncreasingTime &&
                        state.lineIncreasingTime.unit === 'm'
                          ? state.lineIncreasingTime.time
                          : state.lineIncreasingTime.time / 60,
                        state.testMode === TestMode.并发模式
                          ? state.concurrenceNum
                          : state.tpsNum
                      ],
                      [
                        state.pressureTestTime &&
                        state.pressureTestTime.unit === 'm'
                          ? state.pressureTestTime.time
                          : state.pressureTestTime.time / 60,
                        // state.pressureTestTime && state.pressureTestTime.time,
                        state.testMode === TestMode.并发模式
                          ? state.concurrenceNum
                          : state.tpsNum
                      ]
                    ]}
                  />
                )}
                {state.pressureMode === 3 && (
                  <StepCharts chartsInfo={state.stepChartsData} />
                )}
              </div>
            ) : (
              <div>左侧数据填写完整后，展示施压趋势图</div>
            )}
          </div>
        )
      },
      {
        key: 'pressureTestTime',
        label: (
          <span style={{ fontSize: 14 }}>
            压测时长
            <Tooltip
              title="为更好地测试系统性能，建议压测时长不低于2分钟，压测开始后可随时手动停止。"
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue:
            action !== 'add'
              ? state.pressureTestTime.time
              : state.pressureTestTime.time,
          rules: [{ required: true, message: '请输入压测时长' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: <InputNumberPro addonAfter="分" width={90} />
      },
      {
        key: 'pressureMode',
        label: (
          <span style={{ fontSize: 14 }}>
            施压模式
            <Tooltip
              title={`
             1.固定压力值：压力机将会全程保持最大并发量进行施压；
             2.线性递增：压力机将会以固定速率增压，直至达到最大并发量；\n
             3.阶梯递增：压力机将会以固定周期增压，每次增压后保持一段时间，直至达到最大并发量；
             `}
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue:
            action !== 'add' ? detailData.pressureMode : pressureMode,
          rules: [{ required: true, message: '请选择施压模式' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node:
          state.testMode === 0 ? (
            <Radio.Group
            //   onChange={e => handleChangePressureMode(e.target.value)}
            >
              <Radio value={1}>固定压力值</Radio>
              <Radio value={2}>线性递增</Radio>
              <Radio value={3}>阶梯递增</Radio>
            </Radio.Group>
          ) : (
            <Radio.Group
            //   onChange={e => handleChangePressureMode(e.target.value)}
            >
              <Radio value={1}>固定压力值</Radio>
            </Radio.Group>
          )
      }
    ];

    const concurrenceFormData: FormDataType[] = [
      {
        key: 'concurrenceNum',
        label: (
          <span style={{ fontSize: 14 }}>
            最大并发
            <Tooltip
              title="压测场景最终会达到的最大并发量。"
              placement="right"
              trigger="click"
            >
              <Icon style={{ marginLeft: 4 }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue:
            action !== 'add' ? detailData.concurrenceNum : undefined,
          rules: [{ required: true, message: '请输入最大并发数量' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <InputNumber
            min={1}
            max={100000}
            placeholder="请输入1~100,000之间的正整数"
            // onBlur={e =>
            //   getTakinAuthority() === 'true'
            //     ? handleBlurConcurrenceNum(e.target.value)
            //     : true
            // }
            // onChange={value => handleChangeConcurrenceNum(value)}
          />
        )
      }
    ];

    const lineFormData = [
      {
        key: 'lineIncreasingTime',
        label: (
          <span style={{ fontSize: 14 }}>
            递增时长
            <Tooltip
              title="增压直至最大并发量的时间"
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue: state.lineIncreasingTime,
          rules: [{ required: true, message: '请输入递增时长' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <TimeInputWithUnit
          // onBlur={handleBlurLineIncreasingTime}
          // isReload={state.indexss}
          // onChange={handleChangeLineIncreasingTime}
          // selectDisabled={
          //   state.pressureTestTime && state.pressureTestTime.unit === 's'
          //     ? true
          //     : false
          // }
          />
        )
      }
    ];

    const stepFormData = [
      {
        key: 'stepIncreasingTime',
        label: (
          <span style={{ fontSize: 14 }}>
            递增时长
            <Tooltip
              title="增压直至最大并发量的时间"
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue: state.stepIncreasingTime,
          rules: [{ required: true, message: '请输入递增时长' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <TimeInputWithUnit
          // onBlur={handleBlurStepIncreasingTime}
          // isReload={state.indexss}
          />
        )
      },
      {
        key: 'step',
        label: (
          <span style={{ fontSize: 14 }}>
            阶梯层数
            <Tooltip
              title="并发量从0周期增加到最大并发量的次数"
              placement="right"
              trigger="click"
            >
              <Icon type="question-circle" style={{ marginLeft: 4 }} />
            </Tooltip>
          </span>
        ),
        options: {
          initialValue: action !== 'add' ? state.step : state.step,
          rules: [{ required: true, message: '请输入阶梯层数' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <InputNumber
            placeholder="请输入1~100的整数"
            min={1}
            max={100}
            // onChange={handleChangeStep}
            // onBlur={handleBlurStep}
          />
        )
      }
    ];

    let formData = [...basicFormData];

    /** @name 根据压力模式渲染 */
    if (testMode === TestMode.并发模式) {
      formData = [...formData, ...concurrenceFormData, ...commonFormData];
    }

    if (testMode === TestMode.TPS模式) {
      formData = [...formData, ...commonFormData];
    }

    /** @name 根据施压模式渲染 */
    if (testMode !== TestMode.自定义模式) {
      if (pressureMode === 2) {
        formData = formData.concat(lineFormData);
      }
      if (pressureMode === 3) {
        formData = formData.concat(stepFormData);
      }
    }

    return formData;
  };

  return {
    title: '施压配置',
    rowNum: 1,
    span: 14,
    formData: getPressureConfigFormData()
  };
};

export default PressureConfig;
