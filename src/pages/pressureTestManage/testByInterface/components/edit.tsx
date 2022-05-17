import React, { useState, useEffect, useMemo } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
  FormPath,
  createVirtualBox,
} from '@formily/antd';
import {
  Input,
  Select,
  FormBlock,
  Radio,
  ArrayTable,
  FormTextBox,
  Switch,
  DatePicker,
  FormTab,
  FormMegaLayout,
} from '@formily/antd-components';
import { Button, message, Spin, Icon, Form } from 'antd';
import TipTittle from '../../pressureTestSceneV2/components/TipTittle';
import NumberPicker from '../../pressureTestSceneV2/components/NumberPicker';
import DebugModal from '../modals/Debug';
import service from '../service';

interface Props {
  currentSence: any;
}

const EditSence: React.FC<Props> = (props) => {
  const { currentSence } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const [detailLoading, setDetailLoading] = useState(false);
  const [debugInput, setDebugInput] = useState();
  const [debugOutput, setDebugOutput] = useState();

  const HeaderBtn = createVirtualBox('headerBtn', () => {
    return (
      <Button type="primary" onClick={startTest} style={{ float: 'right' }}>
        <Icon type="play-circle" theme="filled" />
        启动压测
      </Button>
    );
  });

  const DebugResult = createVirtualBox('debugReslut', () => {
    return (
      <div>
        <div
          style={{
            padding: 8,
            borderBottom: '1px solid #EEF0F2',
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
          <div>结果</div>
        )}
      </div>
    );
  });

  const startTest = async () => {
    const { values } = await actions.submit();
    service.startSence(values);
  };

  const startDebug = async () => {
    const { values } = await actions.submit();
    setDebugInput(values);
  };

  return (
    <Spin spinning={detailLoading}>
      <SchemaForm
        style={{ padding: 16 }}
        actions={actions}
        initialValues={currentSence}
        validateFirst
        components={{
          Input,
          Select,
          NumberPicker,
          ArrayTable,
          FormBlock,
          FormTextBox,
          Radio,
          Switch,
          DatePicker,
          TextArea: Input.TextArea,
          RadioGroup: Radio.Group,
        }}
      >
        <FormMegaLayout inline>
          <Field
            name="name"
            type="string"
            x-component="Input"
            x-component-props={{
              placeholder: '请输入压测场景名称',
              maxLength: 30,
              style: {
                width: 320,
              },
            }}
            x-rules={[
              {
                required: true,
                whitespace: true,
                message: '请输入压测场景名称',
              },
            ]}
            required
          />
          <HeaderBtn />
        </FormMegaLayout>
        <FormTab name="tabs-1" defaultActiveKey={'tab-1'} type="card">
          <FormTab.TabPane name="tab-1" tab="场景">
            <FormTab
              name="tabs-1-1"
              defaultActiveKey={'tab-1-1'}
              tabBarExtraContent={
                <Button type="primary" ghost size="small" onClick={startDebug}>
                  调试
                </Button>}
            >
              <FormTab.TabPane name="tab-1-1" tab="基本信息">
                <Field
                  name="url"
                  type="string"
                  x-component="TextArea"
                  x-component-props={{
                    placeholder: '请输入',
                    maxLength: 100,
                    rows: 10,
                  }}
                  title="压测URL"
                  x-rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入压测URL',
                    },
                  ]}
                  required
                />
                <Field
                  name="entrance"
                  type="string"
                  x-component="Select"
                  x-component-props={{
                    style: {
                      width: 300,
                    },
                    placeholder: '请选择',
                  }}
                  title={<TipTittle tips="1111">关联应用入口</TipTittle>}
                />
                <FormMegaLayout labelAlign="top" inline autoRow>
                  <Field
                    name="method"
                    type="string"
                    x-component="Select"
                    x-component-props={{
                      placeholder: '请选择',
                      style: {
                        width: 300,
                      },
                    }}
                    title="请求类型"
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
                    x-linkages={[
                      {
                        type: 'value:visible',
                        target: '.tabs-1.tab-1-3',
                        condition: '{{ $self.value !== "GET" }}',
                      },
                    ]}
                  />
                  <Field
                    name="timeout"
                    type="number"
                    x-component="NumberPicker"
                    x-component-props={{
                      placeholder: '请输入',
                      min: 0,
                      addonAfter: 'ms',
                      style: {
                        width: 300,
                      },
                    }}
                    title={
                      <TipTittle tips="超时时间表示请求响应的等待时间，超时之后 http 请求会报超时错误，并且调试结果失败">
                        超时时间
                      </TipTittle>
                    }
                    default={0}
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
                    name="enable302"
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
                    placeholder: `若接口已介入探针，此处回自动扫描数据。若未接入探针，您也可以手动填写\n以 Key/Value 形式填写， 多对 Key/Value 用换行表示，如 :\nkey1:value1\nkey2:value2`,
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
            <DebugResult />
          </FormTab.TabPane>
          <FormTab.TabPane name="tab-2" tab="施压配置">
            122
          </FormTab.TabPane>
        </FormTab>
      </SchemaForm>
      {debugInput && (
        <DebugModal
          details={debugInput}
          okCallback={setDebugOutput}
          cancelCallback={() => setDebugInput(null)}
        />
      )}
    </Spin>
  );
};

export default EditSence;
