import React, { useEffect, useState } from 'react';
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
  NumberPicker,
  Radio,
  ArrayTable,
  FormTextBox,
} from '@formily/antd-components';
import { Button } from 'antd';
import services from './service';
import TargetMap from './components/TargetMap';
import ConfigMap from './components/ConfigMap';
import ConditionTable from './components/ConditionTable';
import { getTakinAuthority } from 'src/utils/utils';
import TipTittle from './components/TipTittle';

const actions = createAsyncFormActions();
const { onFieldValueChange$, onFormMount$ } = FormEffectHooks;

export default (props) => {
  const [businessFlowList, setBusinessFlowList] = useState([]);
  const [threadTree, setThreadTree] = useState([]);

  const getBusinessFlowList = async () => {
    const {
      data: { success, data },
    } = await services.business_activity_flow({});
    if (success) {
      setBusinessFlowList(data);
    }
  };

  const getThreadTree = async (flowId) => {
    if (!flowId) {
      return;
    }
    const {
      data: { success: success1, data: data1 },
    } = await services.sceneDetail({
      id: flowId,
    });
    if (success1) {
      const {
        data: { success: success2, data: data2 },
      } = await services.threadGroupDetail({
        id: flowId,
        xpathMd5: data1.scriptJmxNodeList[0].value,
      });
      if (success2) {
        setThreadTree(data2.threadScriptJmxNodes);
      }
    }
  };

  const useFlowIdChangeEffect = () => {
    const { setFieldState, dispatch } = actions;
    onFieldValueChange$('.basicInfo.businessFlowId').subscribe((fieldState) => {
      getThreadTree(fieldState.value);
    });
  };

  useEffect(() => {
    getBusinessFlowList();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <SchemaForm
        actions={actions}
        components={{
          Input,
          Select,
          NumberPicker,
          TargetMap,
          ConfigMap,
          ArrayTable,
          FormBlock,
          FormTextBox,
          Radio,
          RadioGroup: Radio.Group,
        }}
        // onSubmit={console.log}
        effects={() => {
          useFlowIdChangeEffect();
        }}
      >
        <FormStep
          style={{ width: 600, margin: '40px auto' }}
          size="small"
          labelPlacement="vertical"
          // TODO 移除current
          current={2}
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
                placeholder: '请选择',
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
          <Field type="object" name="goal" x-component="TargetMap" />
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
              }}
              title="压测时长"
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
              <Field name="threadGroupConfigMap" x-component="ConfigMap" />
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
          <ConditionTable />
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
            const isLastStep = state.step.value === 4;
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
        <Submit />
      </SchemaForm>
    </div>
  );
};
