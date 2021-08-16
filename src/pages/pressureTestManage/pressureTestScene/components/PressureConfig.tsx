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
import { PressureMode, PressureSource, TestMode } from '../enum';
import { PressureTestSceneConfigState } from '../pressureTestSceneConfigPage';
import PressureTestSceneService from '../service';
import styles from './../index.less';
import FixLineCharts from './FixLineCharts';
import StepCharts from './StepCharts';

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
      if (state.form) {
        handleCheckIsComplete();
      }
    }, [state.form]);

    /**
     * @name 切换施压模式
     */
    const handleChangePressureMode = value => {
      setState({
        pressureMode: value,
        step: null,
        increasingTime: { time: undefined, unit: 'm' }
      });
      state.form.setFieldsValue({
        increasingTime: undefined,
        pressureMode: value
      });
      handleCheckIsComplete(value);
    };

    /**
     * @name 切换压力模式，初始化相关变量
     */
    const handleChangeMode = async (mode: TestMode) => {
      setState({
        pressureMode: 1,
        /** 压力模式 */
        testMode: mode,
        /** 压测时长 */
        pressureTestTime: { time: undefined, unit: 'm' },
        /** 递增时长 */
        increasingTime: { time: undefined, unit: 'm' },
        ipNum: undefined,
        /** 阶梯层数 */
        step: undefined,
        stepChartsData: null,
        flag: false,
        estimateFlow: null
      });
      state.form.setFieldsValue({
        pressureMode: 1,
        pressureTestTime: undefined
      });

      if (mode === TestMode.自定义模式) {
        return;
      }
      let params = null;
      if (mode === TestMode.并发模式) {
        params = state.concurrenceNum
          ? { concurrenceNum: state.concurrenceNum }
          : null;
      }
      if (mode === TestMode.TPS模式) {
        const list = state.businessList;
        if (!list) {
          return;
        }
        const isEmpty = list.find(item => !item.targetTPS);
        if (isEmpty) {
          return;
        }
        let tpsNum = 0;
        list.forEach(item => {
          tpsNum += item.targetTPS;
        });
        params = { tpsNum };
      }
      if (!params) {
        return;
      }
      if (getTakinAuthority() === 'true') {
        const {
          data: { success, data }
        } = await PressureTestSceneService.getMaxMachineNumber(params);
        if (success) {
          setState({
            ...params,
            ipNum: data.min,
            minIpNum: data.min,
            maxIpNum: data.max
          });
        }
      }
    };

    /**
     * @name 最大并发数失去焦点,计算建议pod数
     */
    const handleBlurConcurrenceNum = async value => {
      handleCheckIsComplete();
      if (testMode === 1) {
        return;
      }
      if (!value) {
        return;
      }
      const {
        data: { success, data }
      } = await PressureTestSceneService.getMaxMachineNumber({
        concurrenceNum: value
      });
      if (success) {
        setState({
          ipNum: data.min,
          minIpNum: data.min,
          maxIpNum: data.max
        });
      }
    };

    /**
     * @name 检测施压配置字段是否完整
     */
    const handleCheckIsComplete = (value?: any) => {
      const data = state.form && state.form.getFieldsValue();
      const concurrenceNum = data && data.concurrenceNum;
      const ipNum = data && data.ipNum;
      const pressureTestTime = data && data.pressureTestTime;
      const increasingTime = data && data.increasingTime;
      const step = data && data.step;
      const pressureMod = value ? value : state.pressureMode;

      const concurrenceNumFlag =
        state.testMode !== TestMode.并发模式 || concurrenceNum;
      if (pressureMod === 1) {
        if (concurrenceNumFlag && ipNum && pressureTestTime) {
          setState({
            flag: true
          });
          return;
        }
      }
      if (pressureMod === 2) {
        if (concurrenceNumFlag && ipNum && pressureTestTime && increasingTime) {
          setState({
            flag: true
          });
          return;
        }
      }
      if (pressureMod === 3) {
        if (
          concurrenceNumFlag &&
          ipNum &&
          pressureTestTime &&
          increasingTime &&
          step
        ) {
          setState({
            flag: true
          });
          handleStepChartsData();
          return;
        }
      }

      setState({
        flag: false
      });
    };

    /**
     * @name 计算stepChartsData
     */
    const handleStepChartsData = () => {
      const midData = [];
      const values = state.form && state.form.getFieldsValue();
      for (
        let i = 0;
        i < (values && values.step);
        // tslint:disable-next-line:no-increment-decrement
        i++
      ) {
        midData.push([
          (values && values.increasingTime / (values && values.step)) * (i + 1),
          ((state.testMode === TestMode.并发模式
            ? values && values.concurrenceNum
            : state.tpsNum) /
            (values && values.step)) *
            (i + 1)
        ]);
      }

      if (midData.length > 0) {
        setState({
          stepChartsData: [[0, 0]]
            .concat(midData)
            .concat([
              [
                values && values.pressureTestTime,
                state.testMode === TestMode.并发模式
                  ? values && values.concurrenceNum
                  : state.tpsNum
              ]
            ])
        });
      }
    };

    /**
     * @name 获取预计消耗流量
     */
    const getEstimateFlow = async () => {
      let result = {};
      const datas = state.form && state.form.getFieldsValue();
      if (pressureMode === 1) {
        result = {
          concurrenceNum: datas && datas.concurrenceNum,
          pressureMode: datas && datas.pressureMode,
          pressureTestTime: datas && datas.pressureTestTime,
          pressureType: datas && datas.testMode
        };
      }
      if (pressureMode === 2) {
        result = {
          concurrenceNum: datas && datas.concurrenceNum,
          increasingTime: datas && datas.increasingTime,
          pressureMode: datas && datas.pressureMode,
          pressureTestTime: datas && datas.pressureTestTime,
          pressureType: datas && datas.testMode
        };
      }
      if (pressureMode === 3) {
        result = {
          concurrenceNum: datas && datas.concurrenceNum,
          increasingTime: datas && datas.increasingTime,
          pressureMode: datas && datas.pressureMode,
          pressureTestTime: datas && datas.pressureTestTime,
          step: datas && datas.step,
          pressureType: datas && datas.testMode
        };
      }
      if (handleCheckIsComplete()) {
        const {
          // tslint:disable-next-line:no-shadowed-variable
          data: { success, data }
        } = await PressureTestSceneService.getEstimateFlow(result);
        if (success) {
          setState({
            estimateFlow: data.data
          });
        }
      } else {
        setState({
          estimateFlow: null
        });
      }
    };

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
            onChange={e => handleChangeMode(e.target.value)}
            options={[
              { label: '并发模式', value: TestMode.并发模式 },
              { label: 'TPS模式', value: TestMode.TPS模式 }
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
            onBlur={() => handleCheckIsComplete()}
          />
        ),
        extra: getTakinAuthority() === 'true' && (
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
            {state.flag ? (
              <div>
                {state.pressureMode === 1 && (
                  <FixLineCharts
                    chartsInfo={[
                      [
                        0,
                        state.testMode === TestMode.并发模式
                          ? state.form &&
                            state.form.getFieldsValue() &&
                            state.form.getFieldsValue().concurrenceNum
                          : state.tpsNum
                      ],
                      [
                        state.form &&
                          state.form.getFieldsValue() &&
                          state.form.getFieldsValue().pressureTestTime,
                        state.testMode === TestMode.并发模式
                          ? state.form &&
                            state.form.getFieldsValue() &&
                            state.form.getFieldsValue().concurrenceNum
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
                        state.form &&
                          state.form.getFieldsValue() &&
                          state.form.getFieldsValue().increasingTime,
                        state.testMode === TestMode.并发模式
                          ? state.form &&
                            state.form.getFieldsValue() &&
                            state.form.getFieldsValue().concurrenceNum
                          : state.tpsNum
                      ],
                      [
                        state.form &&
                          state.form.getFieldsValue() &&
                          state.form.getFieldsValue().pressureTestTime,
                        state.testMode === TestMode.并发模式
                          ? state.form &&
                            state.form.getFieldsValue() &&
                            state.form.getFieldsValue().concurrenceNum
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
        node: (
          <InputNumberPro
            addonAfter="分"
            min={1}
            precision={0}
            onBlur={() => handleCheckIsComplete()}
          />
        )
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
              onChange={e => handleChangePressureMode(e.target.value)}
            >
              <Radio value={PressureMode.固定压力值}>固定压力值</Radio>
              <Radio value={PressureMode.线性递增}>线性递增</Radio>
              <Radio value={PressureMode.阶梯递增}>阶梯递增</Radio>
            </Radio.Group>
          ) : (
            <Radio.Group
              onChange={e => handleChangePressureMode(e.target.value)}
            >
              <Radio value={PressureMode.固定压力值}>固定压力值</Radio>
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
            onBlur={e =>
              getTakinAuthority() === 'true'
                ? handleBlurConcurrenceNum(e.target.value)
                : true
            }
          />
        )
      }
    ];

    const increasingFormData = [
      {
        key: 'increasingTime',
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
          initialValue: state.increasingTime.time,
          rules: [{ required: true, message: '请输入递增时长' }]
        },
        formItemProps: { labelCol: { span: 4 }, wrapperCol: { span: 13 } },
        node: (
          <InputNumberPro
            addonAfter="分"
            onBlur={() => handleCheckIsComplete()}
          />
        )
      }
    ];

    const stepFormData = [
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
            onBlur={() => handleCheckIsComplete()}
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
        formData = [...formData, ...increasingFormData];
      }
      if (pressureMode === 3) {
        formData = [...formData, ...increasingFormData, ...stepFormData];
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
