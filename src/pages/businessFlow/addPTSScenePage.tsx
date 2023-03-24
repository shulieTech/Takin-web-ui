/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Tabs, Collapse,  message } from 'antd';
import { MainPageLayout } from 'src/components/page-layout';
import {  useStateReducer } from 'racc';

import APIPanel from './components/APIPanel';
import BusinessFlowService from './service';
import router from 'umi/router';

const getInitState = () => ({
  details: {} as any,
});
export type State = ReturnType<typeof getInitState>;
const MultiFormComponent = ({ form }) => {
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  const { TabPane } = Tabs;
  const [state, setState] = useStateReducer(getInitState());

  const handleSubmit = async () => {
    validateFields(async (err, values) => {
      if (!err) {
        const formValues = Object.keys(values).reduce((acc, key) => {
          if (key.includes('_')) {
            const [formIndex, field] = key.split('_');
            const index = parseInt(formIndex.replace('form', ''), 10);

            if (!acc[index]) {
              acc[index] = {};
            }

            acc[index][field] = values[key];
          }
          return acc;
        }, []);
        const newFormValues = formValues?.map((item, k) => {
          return {
            apiName: item?.apiName,
            base: {
              allowForward: item?.allowForward,
              requestMethod: item?.requestMethod,
              requestTimeout: item?.requestTimeout,
              requestUrl: item?.requestUrl
            },
            body: {
              forms: item?.forms,
              rawData: item?.rawData
            },
            checkAssert: {
              asserts: item?.asserts
            },
            header: {
              headers: item?.headers
            },
            returnVar: {
              vars: item?.vars
            }
          };
        });

        const result = {
          processName: values?.processName,
          links: [
            {linkName: values?.linkName,
              apis: newFormValues}
          ]};
        if (action === 'edit') {
          const msg = await BusinessFlowService.addPTS({ id, ...result });
          if (msg?.data?.success) {
            message.success('保存成功');
            router.push('/businessFlow');
          } else {
            message.error('保存失败');
          }
          return;
        }  
        const {
        data: { success, data }
      } = await BusinessFlowService.addPTS(result);
        if (success) {
          message.success('保存成功');
          router.push('/businessFlow');
        } else {
          message.error('保存失败');
        }
      }
    });
  };

  function removeApiAtIndex(json, linkIndex, apiIndex) {
    if (json.links && json.links[linkIndex] && json.links[linkIndex].apis) {
      json.links[linkIndex].apis.splice(apiIndex, 1);
    }
  }

  function getUrlParams(url) {
    const queryString = url.split('?')[1];
    if (!queryString) {
      return {};
    }
  
    const params = {};
    const queryParams = queryString.split('&');
  
    queryParams.forEach((param) => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  
    return params;
  }
  
  const id = getUrlParams(window.location.href)?.id;
  const action = getUrlParams(window.location.href)?.action;

  useEffect(() => {
    if (action === 'edit') {
      queryPTSDetail();
    }
  }, []);
 
  const addNode = () => {
    const node = [{
      apiName: '串联链路',
      base: {
        requestMethod: 'GET'
      }
     
    }];
    setState({
      details: {
        ...state?.details,
        links: [{
          linkName: state?.details?.links?.[0]?.linkName,
          apis: state?.details?.links?.[0]?.apis?.concat(node)
        }]
      }
    });
  };

  const childForms = state?.details?.links?.[0]?.apis?.map((formItem, index) => {
    return <APIPanel key={index} form={form} index={index} api={formItem} action={action} />;
  });

  /**
   * @name 获取线程组内容详情
   */
  const queryPTSDetail = async () => {
    const {
        data: { success, data }
      } = await BusinessFlowService.queryPTSDetail({
        id,   
      });
    if (success) {
      setState({
        details: data,
        apis: state?.details?.links?.[0]?.apis
      });
    }
  };

  return (
    <MainPageLayout>
      <div style={{ width: '100%' }}>
      <Form layout="inline">
        <Form.Item label="场景名称">
          {getFieldDecorator('processName', {
            initialValue: action === 'edit' ? state?.details?.processName : undefined,
            rules: [{ required: true, message: '请输入场景名称!' }],
          })(<Input placeholder="请输入场景名称" />)}
        </Form.Item>
      </Form>
      <Tabs defaultActiveKey="1" type="card" style={{ paddingBottom: 50 }}>
    <TabPane tab="场景配置" key="1">
      <Form style={{ border: '1px solid #ddd', padding: '8px 16px' }}>
      <Form layout="inline">
        <Form.Item >
          {getFieldDecorator('linkName', {
            initialValue: action === 'edit' ? state?.details?.links?.[0]?.linkName : undefined,
            rules: [{ required: true, message: '请输入链路!' }],
          })(<Input placeholder="请输入链路名称" />)}
        </Form.Item>
        <Form.Item >
          API数量（生效/总量）:2/2
        </Form.Item>
        <Form.Item style={{ float: 'right' }}>
          <Button type="link">删除</Button>
        </Form.Item>
      </Form>
       {childForms}
  <div style={{ marginTop: 20 }}>
      <Button type="primary" onClick={addNode}>添加压测节点</Button>
  </div>
      </Form>
    </TabPane>
  </Tabs>
  <div style={{ position: 'fixed', bottom: 0, padding: 8, background: '#fff', width: '100%' }}>
      <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>
        保存去压测
      </Button>
      <Button type="primary" onClick={handleSubmit}>
        保存配置
      </Button>
      </div>
      </div>
    </MainPageLayout>
  );
};

const WrappedMultiForm = Form.create({ name: 'multi_form' })(MultiFormComponent);
export default WrappedMultiForm;
