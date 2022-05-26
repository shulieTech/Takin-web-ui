import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaMarkupField as Field,
  FormSpy,
  IFormAsyncActions,
} from '@formily/antd';
import {
  FormTab,
  FormMegaLayout,
  FormCard,
  FormSlot,
} from '@formily/antd-components';
import { Button, Icon } from 'antd';
import TipTittle from '../../pressureTestSceneV2/components/TipTittle';
import service from '../service';
import { getTakinAuthority } from 'src/utils/utils';
import FlowPreview from '../../pressureTestSceneV2/components/FlowPreview';

interface Props {
  actions: IFormAsyncActions;
}

const PressConfigTab: React.FC<Props> = (props) => {
  const { actions } = props;
  return (
    <FormTab.TabPane name="tab-2" tab="施压配置">
      <Field type="object" name="pressureConfigRequest">
        <FormCard
          title="压测目标"
          bordered={false}
          // extra={
          //   <a style={{ textDecoration: 'underline' }}>
          //     如何设定？ <Icon type="right" />
          //   </a>}
        >
          <Field type="object" name="goal" display={false} default={{}} />
          <Field type="object" name="targetGoal">
            <FormMegaLayout labelAlign="top" grid autoRow full columns={4}>
              <Field
                name="tps"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 0,
                  style: {
                    width: '100%',
                  },
                }}
                title={
                  <span style={{ color: '--var(--Netural-800, #5A5E62)' }}>
                    目标TPS
                  </span>}
                x-rules={[
                  {
                    required: true,
                    message: '请输入目标TPS',
                  },
                ]}
                required
                default={0}
              />
              <Field
                name="rt"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 0,
                  style: {
                    width: '100%',
                  },
                }}
                title={
                  <span style={{ color: '--var(--Netural-800, #5A5E62)' }}>
                    目标RT
                  </span>}
                x-rules={[
                  {
                    required: true,
                    message: '请输入目标RT',
                  },
                ]}
                required
                default={0}
              />
              <Field
                name="successRate"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 0,
                  max: 100,
                  style: {
                    width: '100%',
                  },
                }}
                title={
                  <span style={{ color: '--var(--Netural-800, #5A5E62)' }}>
                    目标成功率（%）
                  </span>}
                x-rules={[
                  {
                    required: true,
                    message: '请输入目标成功率',
                  },
                ]}
                required
                default={100}
              />
              <Field
                name="sa"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 0,
                  max: 100,
                  style: {
                    width: '100%',
                  },
                }}
                title={
                  <span style={{ color: '--var(--Netural-800, #5A5E62)' }}>
                    目标SA（%）
                  </span>}
                x-rules={[
                  {
                    required: true,
                    message: '请输入目标SA',
                  },
                ]}
                required
                default={100}
              />
            </FormMegaLayout>
          </Field>
        </FormCard>
        <FormCard
          title="施压配置"
          bordered={false}
          // extra={
          //   <a style={{ textDecoration: 'underline' }}>
          //     如何设定？ <Icon type="right" />
          //   </a>}
        >
          <Field type="object" name="config">
            <Field
              title="压测时间"
              name="duration"
              type="number"
              x-component="NumberPicker"
              x-component-props={{
                placeholder: '请输入',
                min: 1,
                style: {
                  width: 240,
                },
                addonAfter: <Button>分</Button>,
              }}
              x-rules={[
                {
                  required: true,
                  message: '请输入压测时间',
                },
                { format: 'integer', message: '请输入整数' },
              ]}
              x-linkages={[
                {
                  type: 'value:schema',
                  target: '.rampUp',
                  schema: {
                    'x-component-props.max': '{{ $self.value }}',
                  },
                },
              ]}
              required
              default={1}
            />

            <FormSlot>
              <FormSpy>
                {({ state, form }) => {
                  const formValues = form?.getFormState()?.values || {};
                  return (
                    <FlowPreview
                      targetTps={
                        formValues?.pressureConfigRequest?.targetGoal?.tps
                      }
                      duration={
                        formValues?.pressureConfigRequest?.config?.duration
                      }
                      pressConfig={{
                        rampUp:
                          formValues?.pressureConfigRequest?.config
                            ?.threadGroupConfigMap?.rampUp, // 递增时长
                        steps:
                          formValues?.pressureConfigRequest?.config
                            ?.threadGroupConfigMap?.steps, // 递增层数
                        type: formValues?.pressureConfigRequest?.config
                          ?.threadGroupConfigMap?.type, // 压力模式 并发或TPS模式
                        threadNum:
                          formValues?.pressureConfigRequest?.config
                            ?.threadGroupConfigMap?.threadNum, // 最大并发
                        mode: formValues?.pressureConfigRequest?.config
                          ?.threadGroupConfigMap?.mode, //  施压模式: 固定压力值/线性递增/阶梯递增
                      }}
                      checkValid={() => {
                        return Promise.all([
                          form.validate('.duration'),
                          form.validate('.threadNum'),
                          form.validate('.type'),
                          form.validate('.mode'),
                          form.validate('.rampUp'),
                          form.validate('.steps'),
                        ]);
                      }}
                    />
                  );
                }}
              </FormSpy>
            </FormSlot>
            <Field type="object" name="threadGroupConfigMap">
              <Field
                // title={
                //   <TipTittle tips="并发模式：指定最大并发量，按照对应的施压模式进行施压；TPS模式：以目标TPS为限，系统逐步增压，摸高到目标TPS，过程中也可动态调整TPS">
                //     压力模式
                //   </TipTittle>
                // }
                name="type"
                type="number"
                x-component="RadioCard"
                x-rules={[
                  {
                    required: true,
                    message: '请选择压力模式',
                  },
                ]}
                required
                enum={[
                  {
                    label: '并发模式',
                    value: 0,
                    description: (
                      <span>
                        业务流程是压测配置的业务流程是
                        <br />
                        压测配置的
                      </span>
                    ),
                  },
                  // { label: 'TPS模式', value: 1 },
                ]}
                default={0}
                x-component-props={{
                  style: {
                    marginTop: 24,
                  },
                  renderOption: (item, isChecked) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          position: 'relative',
                          alignItems: 'start',
                          padding: 16,
                          border: '1px solid var(--Netural-300, #DBDFE3)',
                          borderRadius: 4,
                        }}
                      >
                        {isChecked && (
                          <span
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: 20,
                              height: 20,
                              lineHeight: '20px',
                              textAlign: 'center',
                              color: '#fff',
                              backgroundColor: '#11BBD5',
                              fontSize: 12,
                              borderRadius: '0 4px 0 8px',
                            }}
                          >
                            <Icon type="check" />
                          </span>
                        )}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            marginRight: 8,
                            lineHeight: '40px',
                            textAlign: 'center',
                            border: '1px solid #11BBD5',
                            borderRadius: 4,
                            background: '#F4FDFE',
                            color: '#11BBD5',
                          }}
                        >
                          {item.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: 'var(--Netural-990, #25282A)',
                              fontSize: 14,
                              fontWeight: 600,
                              marginBottom: 8,
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              color: 'var(--Netural-600, #90959A)',
                              fontSize: 13,
                            }}
                          >
                            {item.description}
                          </div>
                        </div>
                      </div>
                    );
                  },
                }}
                x-linkages={[
                  {
                    type: 'value:schema',
                    target: `.mode`,
                    condition: '{{ $self.value === 1 }}',
                    schema: {
                      enum: [{ label: '固定压力值', value: 1 }],
                    },
                    otherwise: {
                      enum: [
                        { label: '固定压力值', value: 1 },
                        { label: '线性递增', value: 2 },
                        { label: '阶梯递增', value: 3 },
                      ],
                    },
                  },
                  {
                    type: 'value:state',
                    target: `.mode`,
                    condition: '{{ $self.value === 1 }}',
                    state: {
                      value: 1,
                    },
                  },
                  {
                    type: 'value:visible',
                    target: `.threadNum`,
                    condition: '{{ $self.value === 0 }}',
                  },
                ]}
              />
              <Field
                title={
                  <TipTittle tips="压测场景最终会达到的最大并发量。">
                    最大并发
                  </TipTittle>
                }
                name="threadNum"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 1,
                  style: {
                    width: 240,
                  },
                }}
                x-rules={[
                  {
                    required: true,
                    message: '请输入最大并发',
                  },
                  {
                    format: 'integer',
                    minimum: 1,
                    maximum: 100000,
                    message: '请输入1~100,000之间的正整数',
                  },
                ]}
                required
                default={1}
              />
              <Field
                title={
                  <TipTittle
                    tips={
                      <span>
                        1.固定压力值：压力机将会全程保持最大并发量进行施压；
                        <br />
                        2.线性递增：压力机将会以固定速率增压，直至达到最大并发量；
                        <br />
                        3.阶梯递增：压力机将会以固定周期增压，每次增压后保持一段时间，直至达到最大并发量；
                      </span>
                    }
                  >
                    施压模式
                  </TipTittle>
                }
                name="mode"
                type="number"
                x-component="RadioGroup"
                x-rules={[
                  {
                    required: true,
                    message: '请输入最大并发',
                  },
                ]}
                required
                enum={[
                  { label: '固定压力值', value: 1 },
                  { label: '线性递增', value: 2 },
                  { label: '阶梯递增', value: 3 },
                ]}
                default={1}
                x-linkages={[
                  {
                    type: 'value:visible',
                    target: '.rampUp',
                    condition: '{{ $self.value === 2 || $self.value === 3 }}',
                  },
                  {
                    type: 'value:visible',
                    target: '.steps',
                    condition: '{{ $self.value === 3 }}',
                  },
                ]}
              />
              <Field
                title={
                  <TipTittle tips="增压直至最大并发量的时间">
                    递增时长
                  </TipTittle>
                }
                name="rampUp"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 1,
                  addonAfter: <Button>min</Button>,
                  style: {
                    width: 240,
                  },
                }}
                x-rules={[
                  {
                    required: true,
                    message: '请输入递增时长',
                  },
                  { format: 'integer', message: '请输入整数' },
                ]}
                required
                default={5}
              />
              <Field
                title={
                  <TipTittle tips="并发量从0周期增加到最大并发量的次数">
                    阶梯层数
                  </TipTittle>
                }
                name="steps"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 1,
                  max: 100,
                  style: {
                    width: 240,
                  },
                  addonAfter: <Button>min</Button>,
                }}
                x-rules={[
                  {
                    required: true,
                    message: '请输入阶梯层数',
                  },
                  { format: 'integer', message: '请输入整数' },
                ]}
                required
                default={1}
              />
            </Field>
            <Field
              name="podNum"
              type="number"
              x-component="NumberPicker"
              x-component-props={{
                placeholder: '请输入',
                style: {
                  width: 240,
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
        </FormCard>
      </Field>
    </FormTab.TabPane>
  );
};

export default PressConfigTab;
