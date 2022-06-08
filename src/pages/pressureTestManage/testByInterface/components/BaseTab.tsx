import React, { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { SchemaMarkupField as Field, IFormAsyncActions } from '@formily/antd';
import { FormTab, FormMegaLayout, FormSlot } from '@formily/antd-components';
import { Button } from 'antd';
import TipTittle from '../../pressureTestSceneV2/components/TipTittle';
import DebugModal from '../modals/Debug';
// import service from '../service';
// import { debounce } from 'lodash';
import styles from '../index.less';
import LayoutBox from './LayoutBox';
import { connect } from 'dva';

interface Props {
  actions: IFormAsyncActions;
  dictionaryMap: any;
  detail: any;
  isActive?: boolean;
}

const BaseTab: React.FC<Props> = (props) => {
  const {
    actions,
    dictionaryMap: { DEBUG_HTTP_TYPE },
    detail,
    isActive = true,
  } = props;
  const [debugInput, setDebugInput] = useState();
  const [baseTabStyle, setBaseTabStyle] = useState({});

  const onEntranceChange = (val) => {
    actions.getFieldState('.entranceAppName', (state) => {
      const entranceAppList = state.props.enum;
      const entranceItem = entranceAppList.find((x) => x.value === val);
      if (val && entranceItem) {
        // 使用关联应用入口的参数，填充header和body等
        const { header, param } = entranceItem;
        if (header) {
          actions.setFieldState('.headers', (headerState) => {
            headerState.value = header;
          });
        }
        if (param) {
          actions.setFieldState('.body', (bodyState) => {
            bodyState.value = param;
          });
        }
      } else {
        state.value = undefined;
      }
    });
  };

  const startDebug = async () => {
    const res = await actions.validate('.requestUrl');
    if (res?.errors.length === 0) {
      const { values } = await actions.getFormState();
      setDebugInput(values);
    }
  };

  useEffect(() => {
    actions.setFieldState('.debugResult', (state) => {
      state.props['x-component-props'].debugId = '';
    });
  }, [detail?.id]);

  useLayoutEffect(() => {
    const tab1 = document.querySelector('#tab-1');

    const { y } = tab1.getBoundingClientRect();
    setBaseTabStyle({
      display: 'flex',
      flexDirection: 'column',
      minHeight: `calc(100vh - ${y}px)`,
    });
  }, []);

  return (
    <>
      <FormTab.TabPane
        name="tab-1"
        tab="场景"
        id="tab-1"
        style={isActive ? baseTabStyle : {}}
      >
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
                id: 'guide-1',
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
                  // format: 'url',
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
                id="guide-2"
              >
                调试
              </Button>
            </div>
          </FormSlot>
        </LayoutBox>
        <FormTab
          name="tabs-1-1"
          defaultActiveKey={'tab-1-1'}
          style={{ flex: 1 }}
        >
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
                // onSearch: searchEntrance,
                onChange: onEntranceChange,
              }}
              title={
                <TipTittle
                  tips={
                    <div>
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
                name="contentTypeText"
                title={
                  <TipTittle tips="Content-Type 会根据请求 Body 里面的 Cotent-Type 来自动填写">
                    Content-Type
                  </TipTittle>
                }
                x-component="Input"
                editable={false}
                default="application/x-www-form-urlencoded;charset=UTF-8"
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
            <Field name="contentTypeVo" type="object">
              <FormMegaLayout inline>
                <Field
                  type="string"
                  name="codingFormat"
                  x-component="Input"
                  default="UTF-8"
                  display={false}
                />
                <Field
                  type="number"
                  name="radio"
                  x-component="RadioGroup"
                  x-component-props={{
                    style: {
                      lineHeight: '32px',
                    },
                  }}
                  enum={[
                    { label: 'x-www-form-urlencoded', value: 0 },
                    { label: 'Raw', value: 1 },
                  ]}
                  default={0}
                  x-linkages={[
                    {
                      type: 'value:visible',
                      target: '.type',
                      condition: '{{ $self.value !== 0 }}',
                    },
                  ]}
                />
                <Field
                  type="string"
                  name="type"
                  x-component="Select"
                  enum={DEBUG_HTTP_TYPE}
                  default="application/json"
                  x-linkages={[
                    {
                      type: 'value:state',
                      target: 'contentTypeText',
                      state: {
                        value:
                          '{{ ($self.value || "application/x-www-form-urlencoded") + ";charset=UTF-8" }}',
                      },
                    },
                  ]}
                />
              </FormMegaLayout>
            </Field>
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
        <Field
          name=".debugResult"
          x-component="DebugResult"
          x-component-props={{
            detail,
            debugId: '',
          }}
        />
        {/* <DebugResult debugId={debugId} detail={detail} /> */}
      </FormTab.TabPane>
      {debugInput && (
        <DebugModal
          debugInput={debugInput}
          okCallback={(data) => {
            actions.setFieldState('debugResult', (state) => {
              state.props['x-component-props'].debugId = data;
            });
            setDebugInput(null);
          }}
          cancelCallback={() => {
            setDebugInput(null);
          }}
        />
      )}
    </>
  );
};

export default connect(({ common }) => ({ ...common }))(BaseTab);
