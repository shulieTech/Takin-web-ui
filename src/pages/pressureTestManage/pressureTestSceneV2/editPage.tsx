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
} from '@formily/antd-components';
import { Button, message, Spin } from 'antd';
import services from './service';
import TargetMap from './components/TargetMap';
import ConfigMap from './components/ConfigMap';
import ConditionTable from './components/ConditionTable';
import NumberPicker from './components/NumberPicker';
import ValidateCommand from './components/ValidateCommand';
import { getTakinAuthority } from 'src/utils/utils';
import TipTittle from './components/TipTittle';
import { flatTree } from './utils';

const { onFieldValueChange$, onFormMount$ } = FormEffectHooks;

const EditPage = (props) => {
  const actions = useMemo(() => createAsyncFormActions(), []);
  const { dictionaryMap } = props;
  const [businessFlowList, setBusinessFlowList] = useState([]);
  // const [threadTree, setThreadTree] = useState([]);
  const [targetList, setTargetList] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * 获取详情信息
   */
  const getDetailData = async () => {
    const id = props.location.query.id;
    if (id) {
      const {
        data: { success, data },
      } = await services.getSenceDetailV2({ id });
      if (success) {
        setInitialValue(data);
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
   * 根据流程id获取线程树
   * @param flowId
   * @returns
   */
  const getThreadTree = async (flowId) => {
    if (!flowId) {
      return;
    }
    const {
      data: { success, data },
    } = await services.getThreadTree({
      id: flowId,
    });
    if (success) {
      try {
        const parsedData = JSON.parse(data.scriptJmxNode);
        // setThreadTree(parsedData);
        actions.setFieldState('goal', (state) => {
          state.props['x-component-props'].treeData = parsedData || [];
        });
        actions.setFieldState('config.threadGroupConfigMap', (state) => {
          state.props['x-component-props'].flatTreeData =
            flatTree(parsedData, '-1', 'xpathMd5') || [];
        });
      } catch (error) {
        throw error;
      }
    }
  };

  /**
   * 获取流程关联的活动列表
   * @param businessFlowId
   */
  const getBusinessActivityIds = async (businessFlowId) => {
    const {
      data: { success, data },
    } = await services.queryBussinessActivityListWithBusinessFlow({
      businessFlowId,
    });
    if (success) {
      setTargetList(data);
      const businessActivityIds = (data || []).map((x) => x.businessActivityId);
      actions.setFieldState('dataValidation.content', (state) => {
        state.props['x-component-props'].businessActivityIds =
          businessActivityIds;
      });
    }
  };

  /**
   * 监听表单项数据联动变化
   */
  const formEffect = () => {
    const { setFieldState, dispatch } = actions;
    onFieldValueChange$('.basicInfo.businessFlowId').subscribe((fieldState) => {
      getThreadTree(fieldState.value);
      getBusinessActivityIds(fieldState.value);
    });

    onFieldValueChange$('.goal').subscribe((fieldState) => {
      setFieldState('config.threadGroupConfigMap', (state) => {
        state.props['x-component-props'].targetValue = fieldState.value;
      });
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
    setLoading(true);
    Promise.all([getBusinessFlowList(), getDetailData()]).then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Spin spinning={loading}>
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
          initialValues={initialValue}
          components={{
            Input,
            Select,
            NumberPicker,
            TargetMap,
            ConfigMap,
            ValidateCommand,
            ArrayTable,
            FormBlock,
            FormTextBox,
            Radio,
            RadioGroup: Radio.Group,
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
            wrapperCol={10}
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
                  placeholder: '请选择'
                }}
                x-rules={[
                  {
                    required: true,
                    whitespace: true,
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
            </Field>
            <Field
              type="object"
              name="goal"
              x-component="TargetMap"
              x-component-props={{
                treeData: [],
              }}
            />
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
                  addonAfter: <Button>分</Button>
                }}
                title="压测时长"
                minimum={1}
                x-rules={[
                  {
                    required: true,
                    whitespace: true,
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
                    targetValue: {},
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
                  // TODO 获取建议pod数
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
                    whitespace: true,
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
            labelCol={4}
            wrapperCol={10}
            labelAlign={undefined}
            prefixCls={undefined}
          >
            <ConditionTable
              dictionaryMap={dictionaryMap}
              targetList={targetList}
              name="destroyMonitoringGoal"
              title={
                <span style={{ fontSize: 16 }}>
                  终止条件
                  <span style={{ color: '#f7917a', marginLeft: 8 }}>
                    为保证安全压测，所有业务活动需配置含「RT」和「成功率」的终止条件
                  </span>
                </span>}
              arrayFieldProps={{
                'x-rules': [
                  { 
                    validator: val => {
                      if (!(val || []).some(x => x.formulaTarget === '0')) {
                        return '请至少设置1条包含RT的终止条件';
                      }
                      if (!(val || []).some(x => x.formulaTarget === '2')) {
                        return '请至少设置1条包含成功率的终止条件';
                      }
                    } 
                  }
                ]
              }}
            />
            <ConditionTable
              dictionaryMap={dictionaryMap}
              targetList={targetList}
              name="warnMonitoringGoal"
              title={<span style={{ fontSize: 16 }}>告警条件</span>}
              arrayFieldProps={{
                default: [],
              }}
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
                    whitespace: true,
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
                  businessActivityIds: [],
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
