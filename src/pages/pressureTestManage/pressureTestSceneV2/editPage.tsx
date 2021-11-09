import React, { useEffect, useState } from 'react';
import {
  SchemaForm,
  Field,
  FormButtonGroup,
  FormSpy,
  Submit,
  Reset,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import {
  Input,
  Select,
  FormStep,
  FormLayout,
  FormCard,
} from '@formily/antd-components';
import { Button, Cascader } from 'antd';
import services from './service';

const actions = createAsyncFormActions();
const { onFieldValueChange$, onFormMount$ } = FormEffectHooks;

export default () => {
  const [businessFlowList, setBusinessFlowList] = useState([]);
  const [threadTree, setThreadTree] = useState([]);

  const getBusinessFlowList = async () => {
    const { data: { success, data } } = await services.business_activity_flow({});
    if (success) {
      setBusinessFlowList(data);
    }
  };

  const getThreadTree = async (id) => {
    const { data: { success, data } } = await services.sceneList({
      id
    });
    if (success) {
      setThreadTree(data);
    }
  };

  const useFlowIdChangeEffect = () => {
    const { setFieldState, dispatch } = actions;
    onFieldValueChange$('.basicInfo.businessFlowId')
    .subscribe(fieldState => {
      getThreadTree({
        id: fieldState.value,
      });
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
          FormCard,
          Cascader,
        }}
        // onSubmit={console.log}
        effects={() => {
          useFlowIdChangeEffect();
        }}
      >
        <FormStep
          style={{ marginBottom: 20, padding: 20 }}
          dataSource={[
            { title: '压测目标', name: 'step-1' },
            { title: '业务活动配置', name: 'step-2' },
            { title: '施压配置', name: 'step-3' },
            { title: 'SLA配置', name: 'step-4' },
            { title: '数据验证设置', name: 'step-5' },
          ]}
        />
        <FormCard name="step-1" title="压测目标">
          <FormLayout labelCol={4} wrapperCol={10}>
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
                  { required: true, whitespace: true, message: '请输入压测场景名称' }
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
                  { required: true, whitespace: true, message: '请选择业务流程' }
                ]}
                title="业务流程"
                required
                enum={businessFlowList.map((x) => ({
                  label: x.linkName,
                  value: x.linkId,
                }))}
              />
            </Field>
          </FormLayout>
        </FormCard>

        {/* <FormCard name="step-2" title="施压配置">
          <FormLayout labelCol={4} wrapperCol={10}>
            <Field type="object" name="config">

            </Field>
          </FormLayout>
        </FormCard> */}

        {/* <FormSpy
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
            return (
              <FormButtonGroup align="center">
                <Button
                  disabled={state.step.value === 0}
                  onClick={() => {
                    actions.dispatch(FormStep.ON_FORM_STEP_PREVIOUS);
                  }}
                >
                  上一步
                </Button>
                <Button
                  type={state.step.value === 1 ? 'primary' : undefined}
                  onClick={() => {
                    if (state.step.value === 1) {
                      actions.submit();
                    } else {
                      actions.dispatch(FormStep.ON_FORM_STEP_NEXT);
                    }
                  }}
                >
                  {state.step.value === 1 ? '提交' : '下一步'}
                </Button>
                <Reset>重置</Reset>​
              </FormButtonGroup>
            );
          }}
        </FormSpy> */}
        <Submit />
      </SchemaForm>
    </div>
  );
};
