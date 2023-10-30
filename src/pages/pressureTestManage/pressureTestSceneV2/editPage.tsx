/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import { connect } from 'dva';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  FormSpy,
  Submit,
  createAsyncFormActions,
  FormEffectHooks,
  FormPath,
} from '@formily/antd';
import {
  Input,
  Select,
  FormStep,
  FormLayout,
  FormBlock,
  Radio,
  ArrayTable,
  FormTextBox,
  Switch,
  DatePicker,
} from '@formily/antd-components';
import { Button, message, Spin } from 'antd';
import services from './service';
import TargetMap from './components/TargetMap';
import ConfigMap from './components/ConfigMap';
import ConditionTableField from './components/ConditionTableField';
import NumberPicker from './components/NumberPicker';
import ValidateCommand from './components/ValidateCommand';
import ExcludeApps from './components/ExcludeApps';
import { getTakinAuthority } from 'src/utils/utils';
import TipTittle from './components/TipTittle';
import { cloneDeep, debounce } from 'lodash';
import moment from 'moment';
import { CronSelctComponent } from 'src/components/cron-selector/CronSelect';

const { onFieldValueChange$, onFieldInputChange$, onFormMount$ } =
  FormEffectHooks;

const EditPage = (props) => {
  const actions = useMemo(() => createAsyncFormActions(), []);
  const { dictionaryMap } = props;
  const [businessFlowList, setBusinessFlowList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [demandList, setDemandList] = useState([]);
  const [flatTreeData, setFlatTreeData] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { id: sceneId, readOnly } = props.location.query;
  /**
   * 获取详情信息
   */
  const getDetailData = async () => {
    if (sceneId) {
      const {
        data: { success, data },
      } = await services.getSenceDetailV2({ sceneId });
      if (success) {
        setInitialValue(data);
        // 手动触发一次数据变动，不然isScheduler的联动初始化的时候无法触发
        actions.setFieldState('basicInfo', state => {
          state.value = data?.basicInfo;
        });
      }
    }
  };

  /**
   * 获取业务流程下拉列表
   */
  const getBusinessFlowList = async () => {
    const {
      data: { success, data },
    } = await services.business_activity_flow({});
    if (success) {
      setBusinessFlowList(data);
    }
  };
  /**
   * 获取版本下拉列表
   */
  const getVersionList = async () => {
    const {
      data: { success, data },
    } = await services.versionList({});
    if (success) {
      setVersionList(data?.records || []);
    }
  };
  /**
   * 获取需求下拉列表
   */
  const getDemandList = async (params) => {
    const {
      data: { success, data },
    } = await services.demandList(params);
    if (success) {
      setDemandList(data);
    }
  };

  /**
   * 根据流程id获取线程树
   * @param flowId
   * @returns
   */
  const getThreadTree = async (flowId) => {
    if (!flowId) {
      return;
    }
    actions.setFieldState('goal', (state) => {
      state.props['x-component-props'].loading = true;
    });
    setSaving(true);
    const {
      data: { success, data },
    } = await services.getThreadTree({
      id: flowId,
    });
    setSaving(false);
    if (success) {
      try {
        const parsedData = JSON.parse(data.scriptJmxNode, (k, v) => {
          // 处理children为空数组，会显示折叠
          if (k === 'children' && v?.length === 0) {
            return null;
          }
          return v;
        });
        // setThreadTree(parsedData);

        /**
         * 树结构平铺
         * @param nodes
         * @param parentId
         * @returns
         */
        const result = [];
        const flatTree = (nodes, parentId = '-1', idName = 'id') => {
          if (Array.isArray(nodes) && nodes.length > 0) {
            nodes.forEach((node) => {
              const { children, ...rest } = node;
              result.push({
                parentId,
                ...rest,
              });
              flatTree(node.children, node[idName], idName);
            });
            return result;
          }
        };
        const flatTreeData1 = flatTree(parsedData, '-1', 'xpathMd5') || [];
        setFlatTreeData(flatTreeData1);

        actions.setFieldState('goal', (state) => {
          state.props['x-component-props'].treeData = parsedData || [];
          state.props['x-component-props'].flatTreeData = flatTreeData1 || [];
          state.props['x-component-props'].loading = false;
        });

        actions.setFieldState(
          '*(config.threadGroupConfigMap, destroyMonitoringGoal ,warnMonitoringGoal)',
          (state) => {
            state.props['x-component-props'].flatTreeData = flatTreeData1;
          }
        );
      } catch (error) {
        throw error;
      }
    }
  };

  /**
   * 监听表单项数据联动变化
   */
  const formEffect = () => {
    const { setFieldState, dispatch, getFieldState } = actions;
    onFieldValueChange$('.basicInfo.businessFlowId').subscribe((fieldState) => {
      getThreadTree(fieldState.value);
      setFieldState('dataValidation.content', (state) => {
        state.props['x-component-props'].flowId = fieldState.value;
      });
      setFieldState('dataValidation.excludedApplicationIds', (state) => {
        state.props['x-component-props'].flowId = fieldState.value;
      });
    });
    onFieldInputChange$('.basicInfo.businessFlowId').subscribe((fieldState) => {
      // 手动变更业务流程时，清空步骤1之前的目标数据
      setFieldState('goal', (state) => {
        state.value = {};
      });
      setFieldState('goal.*', (state) => {
        state.value = undefined;
      });
      // 手动变更业务流程时，清空步骤2线程组的配置数据
      setFieldState('config.threadGroupConfigMap', (state) => {
        state.initialValue = {};
      });
      // 手动变更业务流程时，清空步骤3之前的终止条件
      setFieldState('destroyMonitoringGoal', (state) => {
        state.value = [{}];
      });
      // 手动变更业务流程时，清空步骤3之前的告警条件
      setFieldState('warnMonitoringGoal', (state) => {
        state.value = [];
      });
      // 手动变更业务流程时，清空步骤4的排出应用值
      setFieldState('dataValidation.excludedApplicationIds', (state) => {
        state.value = [];
      });
    });

    // 每个线程组的递增时长需小于总压测时长
    onFieldValueChange$('.config.duration').subscribe((fieldState) => {
      setFieldState('config.threadGroupConfigMap.*.rampUp', (state) => {
        state.props['x-component-props'].max = fieldState.value || undefined;
      });
    });

    // 联动显示规则表格中的的单位
    const getUnitConfig = (val) => {
      switch (val) {
        case 0:
          return {
            compact: true,
            addonAfter: (
              <Button disabled style={{ paddingLeft: 4, paddingRight: 4 }}>
                ms
              </Button>
            ),
            max: undefined,
          };
        case 1:
          return {
            addonAfter: undefined,
            max: undefined,
          };
        default:
          return {
            compact: true,
            addonAfter: (
              <Button disabled style={{ paddingLeft: 4, paddingRight: 4 }}>
                %
              </Button>
            ),
            max: 100,
          };
      }
    };
    const changeUint = (fieldState) => {
      const sourcePath = FormPath.parse(fieldState.path);
      setFieldState(
        sourcePath.slice(0, sourcePath.length - 1).concat('.formulaNumber'),
        (state) => {
          state.props['x-component-props'] = {
            ...state.props['x-component-props'],
            ...getUnitConfig(fieldState.value),
          };
        }
      );
    };
    onFieldValueChange$('destroyMonitoringGoal.*.formulaTarget').subscribe(
      changeUint
    );

    onFieldValueChange$('warnMonitoringGoal.*.formulaTarget').subscribe(
      changeUint
    );

    if (getTakinAuthority() === 'true') {
      // 获取建议pod数
      onFieldValueChange$(
        // '*(goal.*.tps, config.threadGroupConfigMap.*.threadNum)'
        'config.threadGroupConfigMap.*.threadNum'
      ).subscribe((fieldState) => {
        if (fieldState.value === '' || !fieldState.valid) {
          return;
        }
        // 获取建议pod数
        // debounce(() => {
        getFieldState('config.threadGroupConfigMap', (configState) => {
          const configMap = cloneDeep(configState.value);
          if (!configMap) {
            return;
          }
          getFieldState('goal', async (state) => {
            Object.keys(configMap || {}).forEach((groupKey) => {
              let sum = 0;
              const flatTreeData2 =
                configState.props['x-component-props'].flatTreeData;

              // 递归tps求和
              const getTpsSum = (valueMap, parentId) => {
                flatTreeData2
                  .filter((x) => x.parentId === parentId)
                  .forEach((x) => {
                    sum += valueMap?.[x.xpathMd5]?.tps || 0;
                    getTpsSum(valueMap, x.xpathMd5);
                  });
                return sum;
              };
              configMap[groupKey].tpsSum = getTpsSum(state.value, groupKey);
            });
            const {
              data: { success, data },
            } = await services.querySuggestPodNum(configMap);
            if (success) {
              setFieldState('config.podNum', (podState) => {
                podState.props['x-component-props'].addonAfter = (
                  <Button>
                    建议Pod数:{' '}
                    {data?.min !== data?.max
                      ? `${data?.min}-${data?.max}`
                      : data?.min || '-'}
                  </Button>
                );
              });
            }
          });
        });
        // }, 200)
      });
    }

    onFieldValueChange$('versionId').subscribe(fieldState => {
      if (fieldState.value) {
        getDemandList({
          versionId: fieldState.value,
        });
      }
    });

    onFieldInputChange$('versionId').subscribe(fieldState => {
      setFieldState('demandIds', state => state.value = []);
    });
  };

  /**
   * 提交表单
   * @param values
   */
  const onSubmit = async (values) => {
    setSaving(true);
    const {
      data: { success, data },
    } = await services[props.location.query.id ? 'updateSenceV2' : 'createSenceV2'](values);
    if (success) {
      message.success('操作成功');
      props.history.goBack();
    }
    setSaving(false);
  };

  useEffect(() => {
    setDetailLoading(true);
    Promise.all([
      getBusinessFlowList(),
      getDetailData(),
      // getVersionList(),
    ]).then(() => {
      setDetailLoading(false);
    });
  }, []);

  // 清除编辑时详情数据中前面业务流程的带来的目标数据
  const filteredInitialValue = {
    ...cloneDeep(initialValue),
    versionId: initialValue.versionId || undefined,
    demandIds: initialValue.demandIds || [],
  };
  Object.keys(filteredInitialValue?.goal || {}).forEach((x) => {
    if (!flatTreeData.some((y) => y.xpathMd5 === x)) {
      delete filteredInitialValue.goal[x];
    }
  });

  return (
    <Spin spinning={detailLoading}>
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontSize: 20,
            borderBottom: '1px solid #ddd',
            paddingBottom: 10,
          }}
        >
          压测场景配置
        </div>
        <SchemaForm
          actions={actions}
          editable={!readOnly}
          initialValues={filteredInitialValue}
          validateFirst
          components={{
            Input,
            Select,
            NumberPicker,
            TargetMap,
            ConfigMap,
            ConditionTableField,
            ValidateCommand,
            ArrayTable,
            FormBlock,
            FormTextBox,
            Radio,
            Switch,
            DatePicker,
            ExcludeApps,
            CronSelctComponent,
            RadioGroup: Radio.Group,
            TextArea: Input.TextArea,
          }}
          onSubmit={onSubmit}
          effects={() => {
            formEffect();
          }}
        >
          <FormStep
            style={{ width: 600, margin: '40px auto' }}
            size="small"
            labelPlacement="vertical"
            // current={2}
            dataSource={[
              { title: '压测目标', name: 'step-1' },
              { title: '施压配置', name: 'step-2' },
              { title: 'SLA配置', name: 'step-3' },
              { title: '数据验证设置', name: 'step-4' },
            ]}
          />
          <FormLayout
            name="step-1"
            labelCol={4}
            wrapperCol={16}
            prefixCls={undefined}
            labelAlign={undefined}
          >
            <Field name="basicInfo" type="object">
              <Field
                name="name"
                type="string"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                  maxLength: 30,
                  readOnly: !!sceneId,
                  style: {
                    backgroundColor: !!sceneId ? '#f7f8f9' : undefined
                  }
                }}
                title="压测场景名称"
                x-rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入压测场景名称',
                  },
                ]}
                required
              />
              <Field
                name="businessFlowId"
                type="number"
                x-component="Select"
                x-component-props={{
                  placeholder: '请选择',
                  filterOption: (inputValue, option) => {
                    return inputValue
                      ? option.props?.title?.includes(inputValue)
                      : true;
                  },
                  showSearch: true,
                  disabled: !!sceneId,
                }}
                x-rules={[
                  {
                    required: true,
                    message: '请选择业务流程',
                  },
                ]}
                title="业务流程"
                required
                enum={businessFlowList.map((x) => ({
                  label: x.sceneName,
                  value: x.id,
                }))}
              />
              {/* <Field
                name="isScheduler"
                type="boolean"
                x-component="Switch"
                title="是否定时启动"
                x-linkages={[
                  {
                    type: 'value:visible',
                    target: '.executeTime',
                    condition: '{{ $self.value }}',
                  },
                ]}
              /> */}
              <Field
                name="isScheduler"
                type="number"
                x-component="RadioGroup"
                title="执行方式"
                enum={[
                  { label: '手动', value: 0 },
                  { label: '定时', value: 1 },
                  { label: '周期', value: 2 },
                ]}
                x-linkages={[
                  {
                    type: 'value:visible',
                    target: '.executeTime',
                    condition: '{{ $self.value === 1 }}',
                  },
                  {
                    type: 'value:visible',
                    target: '.executeCron',
                    condition: '{{ $self.value === 2 }}',
                  },
                ]}
                default={0}
              />
              <Field
                name="executeTime"
                type="number"
                x-component="DatePicker"
                title="启动时间"
                x-component-props={{
                  style: { width: 240 },
                  showTime: { format: 'HH:mm' },
                  format: 'YYYY-MM-DD HH:mm',
                  disabledDate: (currentDate) =>
                    moment().isAfter(currentDate, 'day'),
                }}
                x-rules={[
                  {
                    required: true,
                    message: '请选择启动时间',
                  },
                  {
                    validator: (val) => {
                      return val && moment(val).valueOf() <= moment().valueOf()
                        ? '启动时间需晚于当前时间'
                        : '';
                    },
                  },
                ]}
              />
              <Field
                name="executeCron"
                type="string"
                x-component="CronSelctComponent"
                title="执行周期"
                x-rules={[
                  {
                    required: true,
                    message: '请选择执行周期',
                  },
                ]}
                default="* * * * *"
              />
            </Field>
            <Field
              type="object"
              name="goal"
              x-component="TargetMap"
              x-component-props={{
                treeData: [],
                loading: false,
              }}
            />
            {/* <Field
              name="versionId"
              type="number"
              x-component="Select"
              x-component-props={{
                placeholder: '请选择',
                filterOption: (inputValue, option) => {
                  return inputValue
                    ? option.props?.title?.includes(inputValue)
                    : true;
                },
                showSearch: true,
              }}
              title="版本"
              enum={(versionList).map((x) => ({
                label: x.name,
                value: x.id,
              }))}
            /> */}
            {/* <Field
              name="demandIds"
              type="number"
              x-component="Select"
              x-component-props={{
                placeholder: '请选择',
                filterOption: (inputValue, option) => {
                  return inputValue
                    ? option.props?.title?.includes(inputValue)
                    : true;
                },
                showSearch: true,
                mode: 'multiple',
              }}
              title="需求"
              enum={demandList.map((x) => ({
                label: x.title,
                value: x.id,
              }))}
            /> */}
          </FormLayout>

          <FormLayout
            name="step-2"
            labelCol={4}
            wrapperCol={10}
            labelAlign={undefined}
            prefixCls={undefined}
          >
            <Field type="object" name="config">
              <Field
                name="unit"
                type="string"
                x-component="Input"
                default="m"
                display={false}
              />
              <Field
                name="duration"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  style: {
                    width: '100%',
                  },
                  min: 1,
                  precision: 0,
                  addonAfter: <Button>分</Button>,
                }}
                title="压测时长"
                minimum={1}
                x-rules={[
                  {
                    required: true,
                    message: '请输入压测时长',
                  },
                ]}
                required
              />
              <FormLayout name="pannelLayout" labelCol={8} wrapperCol={16}>
                <Field
                  name="threadGroupConfigMap"
                  x-component="ConfigMap"
                  x-component-props={{
                    flatTreeData: [],
                  }}
                />
              </FormLayout>

              <Field
                name="podNum"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  style: {
                    width: '100%',
                  },
                  min: 1,
                  default: 1,
                  addonAfter: <Button>建议Pod数: -</Button>,
                  disabled: getTakinAuthority() !== 'true',
                }}
                title={
                  <TipTittle tips="指定压力机pod数量，可参考建议值范围。指定数量过高可能导致硬件资源无法支持；指定数量过低可能导致发起压力达不到要求">
                    指定Pod数
                  </TipTittle>
                }
                x-rules={[
                  {
                    required: true,
                    message: '请输入Pod数',
                  },
                ]}
                required
                default={1}
              />
            </Field>
          </FormLayout>

          <FormLayout
            name="step-3"
            // labelCol={4}
            // wrapperCol={10}
            labelAlign={undefined}
            prefixCls={undefined}
          >
            <Field
              name="destroyMonitoringGoal"
              x-component="ConditionTableField"
              x-component-props={{
                dictionaryMap,
                tableTitle: (
                  <span style={{ fontSize: 16 }}>
                    终止条件
                    <span style={{ color: '#f7917a', marginLeft: 8 }}>
                      为保证安全压测，所有业务活动需配置含「RT」和「成功率」的终止条件
                    </span>
                  </span>
                ),
                minItems: 1,
                flatTreeData: [],
              }}
              default={[{}]}
            />
            <Field
              name="warnMonitoringGoal"
              x-component="ConditionTableField"
              x-component-props={{
                dictionaryMap,
                tableTitle: <span style={{ fontSize: 16 }}>告警条件</span>,
                flatTreeData: [],
              }}
              default={[]}
            />
            <Field
              name="notifyEmails"
              title={
                <TipTittle tips="告警信息将会发送到指定邮箱">
                  邮件告警
                </TipTittle>
              }
              x-component="TextArea"
              x-component-props={{
                placeholder: '请输入邮箱地址，多条数据请用换行分隔',
                rows: 5,
              }}
              x-mega-props={{
                full: true,
                labelCol: 24,
                wrapperCol: 24,
              }}
              x-rules={[
                {
                  validator: (val) => {
                    if (val && val.split('\n').length > 0) {
                      const arr = val.split('\n');
                      if (
                        arr.some(
                          (x) =>
                            !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(
                              x
                            )
                        )
                      ) {
                        return '请输入正确格式的邮箱地址';
                      }
                      return '';
                    }
                  },
                },
              ]}
            />
          </FormLayout>

          <FormLayout
            name="step-4"
            labelCol={4}
            wrapperCol={10}
            labelAlign={undefined}
            prefixCls={undefined}
          >
            <Field name="dataValidation" type="object">
              <Field
                name="timeInterval"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  style: {
                    width: '100%',
                  },
                  min: 1,
                  max: 59,
                  default: 1,
                  addonAfter: <Button>分</Button>,
                }}
                title={
                  <TipTittle
                    tips="时间间隔指数据验证命令循环执行的时间，时间间隔越短，对数据库性能损耗越高，最大不得超过压测总时长。

                根据验证命令实际执行情况，实际间隔时间可能会有少许出入，属于正常情况。"
                  >
                    时间间隔
                  </TipTittle>
                }
                x-rules={[
                  {
                    required: true,
                    message: '请输入时间间隔',
                  },
                ]}
                required
              />
              <Field
                name="content"
                title="验证命令"
                x-component="ValidateCommand"
                x-component-props={{
                  flowId: '',
                }}
              />
              <Field
                name="excludedApplicationIds"
                title={
                  <TipTittle tips="可控制参与压测的应用范围。不参与压测的应用可忽略，忽略的应用将不进行启动校验。请确保这些应用的安全性！">
                    应用范围控制
                  </TipTittle>
                }
                x-component="ExcludeApps"
                x-component-props={{
                  flowId: '',
                }}
              />
            </Field>
          </FormLayout>

          <FormSpy
            selector={FormStep.ON_FORM_STEP_CURRENT_CHANGE}
            initialState={{
              step: { value: 0 },
            }}
            reducer={(state, action) => {
              switch (action.type) {
                case FormStep.ON_FORM_STEP_CURRENT_CHANGE:
                  return { ...state, step: action.payload };
                default:
                  return { step: { value: 0 } };
              }
            }}
          >
            {({ state }) => {
              const isLastStep = state.step.value === 3;
              return (
                <FormButtonGroup align="center" sticky>
                  <Button
                    disabled={state.step.value === 0}
                    onClick={() => {
                      actions.dispatch(FormStep.ON_FORM_STEP_PREVIOUS);
                    }}
                  >
                    上一步
                  </Button>
                  {!(isLastStep && readOnly) && (
                    <Button
                      type={isLastStep ? 'primary' : undefined}
                      loading={saving}
                      onClick={() => {
                        if (isLastStep) {
                          actions.submit();
                        } else {
                          actions.dispatch(FormStep.ON_FORM_STEP_NEXT);
                        }
                      }}
                    >
                      {isLastStep ? '保存' : '下一步'}
                    </Button>
                  )}
                  {/* <Button
                    onClick={() =>
                      actions.getFormState((state) => console.log(state.values))
                    }
                  >
                    test
                  </Button> */}
                  {/* <Reset>重置</Reset>​ */}
                </FormButtonGroup>
              );
            }}
          </FormSpy>
          {/* <Submit/> */}
        </SchemaForm>
      </div>
    </Spin>
  );
};

export default connect(({ common }) => ({ ...common }))(EditPage);
