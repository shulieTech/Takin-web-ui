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
      <FormCard
        title="压测目标"
        bordered={false}
        extra={
          <a style={{ textDecoration: 'underline' }}>
            如何设定？ <Icon type="right" />
          </a>}
      >
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
          />
          <Field
            name="RT"
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
          />
        </FormMegaLayout>
      </FormCard>
      <FormCard
        title="施压配置"
        bordered={false}
        extra={
          <a style={{ textDecoration: 'underline' }}>
            如何设定？ <Icon type="right" />
          </a>}
      >
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
            addonAfter: <Button>min</Button>,
          }}
          x-rules={[
            {
              required: true,
              message: '请输入压测时间',
            },
            { format: 'integer', message: '请输入整数' },
          ]}
          required
        />
        <FormSlot>
          <FormSpy>
            {({ state, form }) => {
              const formValues = form?.getFormState()?.values || {};
              return (
                <FlowPreview
                  targetTps={formValues.tps}
                  duration={formValues.duration}
                  pressConfig={{
                    rampUp: formValues.rampUp, // 递增时长
                    steps: formValues.steps, // 递增层数
                    type: formValues.type, // 压力模式 并发或TPS模式
                    threadNum: formValues.threadNum, // 最大并发
                    mode: formValues.mode, //  施压模式: 固定压力值/线性递增/阶梯递增
                  }}
                />
              );
            }}
          </FormSpy>
        </FormSlot>
        <Field
          title={
            <TipTittle tips="并发模式：指定最大并发量，按照对应的施压模式进行施压；TPS模式：以目标TPS为限，系统逐步增压，摸高到目标TPS，过程中也可动态调整TPS">
              压力模式
            </TipTittle>
          }
          name="type"
          type="number"
          x-component="RadioGroup"
          x-rules={[
            {
              required: true,
              message: '请选择压力模式',
            },
          ]}
          required
          enum={[
            { label: '并发模式', value: 0 },
            { label: 'TPS模式', value: 1 },
          ]}
          default={0}
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
            <TipTittle tips="增压直至最大并发量的时间">递增时长</TipTittle>
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
        />
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
      </FormCard>
    </FormTab.TabPane>
  );
};

export default PressConfigTab;
