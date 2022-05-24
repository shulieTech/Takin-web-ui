import React, { useState, useEffect, useMemo } from 'react';
import { SchemaMarkupField as Field, IFormAsyncActions } from '@formily/antd';
import { FormTab, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { Button } from 'antd';
import TipTittle from '../../pressureTestSceneV2/components/TipTittle';
import DebugModal from '../modals/Debug';
import service from '../service';
import { debounce } from 'lodash';
import styles from '../index.less';
import LayoutBox from './LayoutBox';

interface Props {
  actions: IFormAsyncActions;
}

const BaseTab: React.FC<Props> = (props) => {
  const { actions } = props;
  const [debugInput, setDebugInput] = useState();
  const [debugOutput, setDebugOutput] = useState();

  const searchEntrance = debounce(async (val) => {
    actions.setFieldState('.entranceAppName', (state) => {
      state.loading = true;
    });
    try {
      const {
        data: { success, data },
      } = await service.searchEntrance(val);
      if (success) {
        actions.setFieldState('.entranceAppName', (state) => {
          state.props.enum = data;
        });
      }
    } finally {
      actions.setFieldState('.entranceAppName', (state) => {
        state.loading = false;
      });
    }
  }, 500);

  const startDebug = async () => {
    const res = await actions.validate('.url');
    if (res?.errors.length === 0) {
      const { values } = await actions.getFormState();
      setDebugInput(values);
    }
  };

  return (
    <>
      <FormTab.TabPane name="tab-1" tab="场景">
        <LayoutBox
          x-component-props={{ style: { display: 'flex', alignItems: 'top' } }}
        >
          <LayoutBox>
            <Field
              name="httpMethod"
              type="string"
              x-component="Select"
              x-component-props={{
                placeholder: '请选择',
                className: styles['custom-select'],
                style: {
                  width: 140,
                  verticalAlign: -1,
                },
              }}
              // title="请求类型"
              enum={[
                { label: 'GET', value: 'GET' },
                { label: 'POST', value: 'POST' },
                { label: 'PUT', value: 'PUT' },
                { label: 'DELETE', value: 'DELETE' },
                { label: 'PATCH', value: 'PATCH' },
              ]}
              default="GET"
              x-rules={[
                {
                  required: true,
                  message: '请选择请求类型',
                },
              ]}
              required
              // x-linkages={[
              //   {
              //     type: 'value:visible',
              //     target: '.tabs-1.tab-1.tabs-1-1.tab-1-3',
              //     condition: '{{ $self.value !== "GET" }}',
              //   },
              // ]}
            />
          </LayoutBox>
          <LayoutBox
            x-component-props={{ style: { flex: 1, marginRight: 40 } }}
          >
            <Field
              name="requestUrl"
              type="string"
              x-component="Input"
              x-component-props={{
                placeholder: '请输入URL',
                maxLength: 200,
                style: {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderLeft: 'none',
                },
              }}
              // title="压测URL"
              x-rules={[
                {
                  required: true,
                  whitespace: true,
                  format: 'url',
                  message: '请输入正确的压测URL',
                },
              ]}
              required
            />
          </LayoutBox>
          <FormSlot>
            <div style={{ lineHeight: '40px' }}>
              <Button
                type="primary"
                style={{ marginRight: 16 }}
                ghost
                onClick={startDebug}
              >
                调试
              </Button>
            </div>
          </FormSlot>
        </LayoutBox>
        <FormTab name="tabs-1-1" defaultActiveKey={'tab-1-1'}>
          <FormTab.TabPane name="tab-1-1" tab="基本信息">
            <Field
              name="entranceAppName"
              type="string"
              x-component="Select"
              x-component-props={{
                style: {
                  width: 480,
                },
                placeholder: '请选择',
                allowClear: true,
                showSearch: true,
                onSearch: searchEntrance,
              }}
              title={
                <TipTittle
                  tips={
                    <div>
                      {' '}
                      1.
                      关联应用入口后，可自动填充采集到header头、请求入参数据。
                      2. 压测过程中可追踪该入口链路的应用容量水位
                    </div>
                  }
                >
                  关联应用入口
                </TipTittle>
              }
            />
            <FormMegaLayout labelAlign="top" inline autoRow>
              <Field
                name="timeout"
                type="number"
                x-component="NumberPicker"
                x-component-props={{
                  placeholder: '请输入',
                  min: 0,
                  addonAfter: <Button>ms</Button>,
                  style: {
                    width: 300,
                  },
                }}
                title={
                  <TipTittle tips="超时时间表示请求响应的等待时间，超时之后 http 请求会报超时错误，并且调试结果失败">
                    超时时间
                  </TipTittle>
                }
                default={5000}
                x-rules={[
                  {
                    required: true,
                    message: '请输入超时时间',
                  },
                  { format: 'integer', message: '请输入整数' },
                ]}
                required
              />
              <Field
                name="isRedirect"
                type="boolean"
                x-component="Switch"
                title={
                  <TipTittle tips="允许跳转到其他页面的状态码，最大跳转次数为10次，否则按照当前请求的返回结果统计">
                    允许302跳转
                  </TipTittle>
                }
                default={false}
                x-rules={[
                  {
                    required: true,
                    message: '请选择是否允许302跳转',
                  },
                ]}
                required
                x-component-props={{
                  width: 'auto',
                }}
              />
            </FormMegaLayout>
          </FormTab.TabPane>
          <FormTab.TabPane name="tab-1-2" tab="Header">
            <FormMegaLayout full>
              <Field
                type="string"
                name="contentType"
                title={<TipTittle tips="333">Content-Type</TipTittle>}
                x-component="Input"
                x-component-props={{
                  placeholder:
                    'application/x-www-form-urlencoded;charset=UTF-8',
                }}
              />
            </FormMegaLayout>
            <Field
              type="string"
              name="headers"
              x-component="TextArea"
              x-component-props={{
                placeholder: `若接口已接入探针，此处回自动扫描数据。若未接入探针，您也可以手动填写\n以 Key/Value 形式填写， 多对 Key/Value 用换行表示，如 :\nkey1:value1\nkey2:value2`,
                maxLength: 500,
                rows: 10,
              }}
            />
          </FormTab.TabPane>
          <FormTab.TabPane name="tab-1-3" tab="Body">
            <Field
              type="number"
              name="bodyType"
              x-component="RadioGroup"
              enum={[
                { label: 'x-www-form-urlencoded', value: 0 },
                { label: 'Raw', value: 1 },
              ]}
              default={0}
            />
            <Field
              type="string"
              name="body"
              x-component="TextArea"
              x-component-props={{
                placeholder: `请输入不同键值对（Key/Value）以 JSON 格式填写，如：\n{“userId”:12,”userName”:”Shulie”}`,
                maxLength: 500,
                rows: 10,
              }}
            />
          </FormTab.TabPane>
        </FormTab>
        <FormSlot>
          <div>
            <div
              style={{
                padding: '8px 0',
                borderTop: '1px solid #EEF0F2',
                color: 'var(--Netural-500, #AEB2B7)',
              }}
            >
              响应结果
            </div>
            {!debugOutput ? (
              <div
                style={{
                  color: 'var(--Netural-800, #5A5E62)',
                  lineHeight: '20px',
                  textAlign: 'center',
                  padding: '40px 0',
                }}
              >
                您可以输入一个URL，点击调
                <br />
                试后，可在此查看响应结果
              </div>
            ) : (
              <div
                style={{
                  borderTop: '1px solid #EEF0F2',
                }}
              >
                结果
              </div>
            )}
          </div>
        </FormSlot>
      </FormTab.TabPane>
      {debugInput && (
        <DebugModal
          details={debugInput}
          okCallback={setDebugOutput}
          cancelCallback={() => setDebugInput(null)}
        />
      )}
    </>
  );
};

export default BaseTab;
