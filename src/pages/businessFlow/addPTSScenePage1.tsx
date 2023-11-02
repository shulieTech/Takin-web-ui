/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Tabs, Collapse,  message, Dropdown, Menu, Icon, Switch, Modal, Table } from 'antd';
import { MainPageLayout } from 'src/components/page-layout';
import {  CommonSelect, useStateReducer } from 'racc';

import APIPanel from './components/APIPanel';
import BusinessFlowService from './service';
import router from 'umi/router';
import { getUrlParams } from 'src/utils/utils';
import CsvForm from './components/CsvForm';
import IB2Node from './components/IB2Node';
import GlobalHeaderTable from './components/GlobalHeaderTable';
import GlobalHttp from './components/GlobalHttp';
import CountForm from './components/CountForm';
import copy from 'copy-to-clipboard';

const getInitState = () => ({
  details: {} as any,
  javaRequestDetails: {} as any,
  loading: false,
  visible: false,
  functionList: [],
  selectedFunction: undefined,
  functionExample: undefined,
  apis: [{
    apiName: '',
    apiType: 'HTTP',
    base: {
      allowForward: true,
      requestMethod: 'GET',
      requestTimeout: undefined,
      requestUrl: ''
    },
    body: {
      forms: [
        {
          key: '',
          value: ''
        }
      ],
      rawData: ''
    },
    checkAssert: {
      asserts: [
        {
          checkCondition: '',
          checkContent: '',
          checkObject: '',
          checkPointType: ''
        }
      ]
    },
    header: {
      headers: [
        {
          key: '',
          value: ''
        }
      ]
    },
    returnVar: {
      vars: [
        {
          matchIndex: 0,
          parseExpress: '',
          testName: '',
          varName: '',
          varSource: ''
        }
      ]
    }
  }
  ],
  links: [
    { 
      linkName: '链路名称',
      linkType: 'normal',
      enabled: true,
      apis: [{
        apiName: '',
        apiType: 'HTTP',
        base: {
          allowForward: true,
          requestMethod: 'GET',
          requestTimeout: undefined,
          requestUrl: ''
        },
        body: {
          forms: [
            {
              key: '',
              value: ''
            }
          ],
          rawData: ''
        },
        checkAssert: {
          asserts: [
            {
              checkCondition: '',
              checkContent: '',
              checkObject: '',
              checkPointType: ''
            }
          ]
        },
        header: {
          headers: [
            {
              key: '',
              value: ''
            }
          ]
        },
        returnVar: {
          vars: [
            {
              matchIndex: 0,
              parseExpress: '',
              testName: '',
              varName: '',
              varSource: ''
            }
          ]
        }
      }
      ]
    }
  ],
  csvs: [],
  counters: [],
  formFields: [],
  globalHttp: {
    contentEncoding: null,
    domain:  null,
    path: null,
    port:  null,
    protocol: null
  }
});
export type State = ReturnType<typeof getInitState>;
const MultiFormComponent = ({ form }) => {
  const { getFieldDecorator, validateFields, getFieldValue } = form;
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const [state, setState] = useStateReducer(getInitState());

  function transformData(inputObj) {
    const links = {};

    for (const key in inputObj) {
      if (!key.includes('_')) { continue; }
    
      const match = key.match(/(\d+)(?:_(\d+))?(?:_(.+))?/);
    
      if (!match) { continue; }
    
      const [_, linkIndex, apiIndex, apiKey] = match;
    
      const link = links[linkIndex] || (links[linkIndex] = { apis: {} });
    
      if (apiIndex) {
        const api = link.apis[apiIndex] || (link.apis[apiIndex] = {});
    
        if (apiKey) {
          api[apiKey] = inputObj[key];
        } else {
          api[apiIndex] = inputObj[key];
        }
      } else {
        const newKey = key.substring(key.indexOf('_') + 1);
        link[newKey] = inputObj[key];
      }
    }
    
    const outputData = Object.entries(links).map(([_, link]) => {
      const linkObj = {};
      const apis = Object.values(link.apis);
      linkObj.apis = apis;
    
      for (const key in link) {
        if (key !== 'apis') {
          linkObj[key] = link[key];
        }
      }
    
      return linkObj;
    });
    return outputData;
  }

  const handleSubmit = async () => {

    await validateFields(async (err, values) => {
      if (!err) {
        console.log('values-----', values);
        
        const formValues = transformData(values);
        console.log('formValues', transformData(values));

        const newFormValues = formValues?.map((itemLink: any, kLink) => {
          return {
            linkName: itemLink?.linkName,
            linkType: itemLink?.linkType,
            enabled: itemLink?.enabled,
            apis: itemLink?.apis?.filter((ite) => {if (ite?.apiName) {return ite; }})?.map((item, k) => {
              if (item?.apiType === 'HTTP') {
                return {
                  apiName: item?.apiName,
                  apiType: item?.apiType,
                  base: {
                    allowForward: item?.allowForward,
                    requestMethod: item?.requestMethod,
                    requestTimeout: item?.requestTimeout,
                    requestUrl: item?.requestUrl
                  },
                  body: {
                    forms: item?.forms,
                    rawData: item?.rawData,
                    contentType: item?.contentType
                  },
                  checkAssert: {
                    asserts: item?.asserts
                  },
                  header: {
                    headers: item?.headers
                  },
                  returnVar: {
                    vars: item?.vars
                  },
                  timer: {
                    delay: item?.delay
                  },
                  beanShellPre: {
                    script: [item?.beanShellPre]
                  },
                  beanShellPost: {
                    script: [item?.beanShellPost]
                  },
                  enabled: item?.enabled
                };
              }
              if (item?.apiType === 'JAVA') {
                return {
                  apiName: item?.apiName,
                  apiType: item?.apiType,
                  base: {
                    requestUrl: item?.requestUrl
                  },
                  param: {
                    params: item?.params
                  },
                  checkAssert: {
                    asserts: item?.asserts
                  },
                  enabled: item?.enabled
                };
              }
            })
          };
        }).filter((fItem, fK) => {
          if (fItem?.linkName) {
            return fItem;
          }
        });

        const csvs = action === 'edit' ? state?.details?.dataSource?.csvs : state?.csvs;
        const counters = action === 'edit' ? state?.details?.counters : state?.counters;
        const globalHttp = action === 'edit' ? state?.details?.globalHttp : state?.globalHttp;

        const result = {
          globalHttp,
          counters,
          processName: values?.processName,
          links: newFormValues,
          dataSource: {
            csvs
          },
          globalHeader: {
            headers: values?.globalHeader
          },
          userVars: values?.userVars,
        };
        console.log('resiult', result);
           
        if (action === 'edit') {
          setState({
            loading: true
          });
          const msg = await BusinessFlowService.addPTS({ id, ...result });
          if (msg?.data?.success) {
            message.success('保存成功');
            router.push('/businessFlow');
            setState({
              loading: false
            });
            return;
          } 
          setState({
            loading: false
          });
          return;
         
        } 
        setState({
          loading: true
        }); 
        const {
        data: { success, data }
      } = await BusinessFlowService.addPTS(result);
        if (success) {
          setState({
            loading: false
          });
          message.success('保存成功');
          router.push('/businessFlow');
          return;
        } 
        setState({
          loading: false
        });
      }
    });
  };

  const handleDebug = async () => {
    validateFields(async (err, values) => {
      if (!err) {
        const formValues = transformData(values);

        const newFormValues = formValues?.map((itemLink: any, kLink) => {
          return {
            linkName: itemLink?.linkName,
            linkType: itemLink?.linkType,
            enabled: itemLink?.enabled,
            apis: itemLink?.apis?.filter((ite) => {if (ite?.apiName) {return ite; }})?.map((item, k) => {
              if (item?.apiType === 'HTTP') {
                return {
                  apiName: item?.apiName,
                  apiType: item?.apiType,
                  base: {
                    allowForward: item?.allowForward,
                    requestMethod: item?.requestMethod,
                    requestTimeout: item?.requestTimeout,
                    requestUrl: item?.requestUrl
                  },
                  body: {
                    forms: item?.forms,
                    rawData: item?.rawData,
                    contentType: item?.contentType
                  },
                  checkAssert: {
                    asserts: item?.asserts
                  },
                  header: {
                    headers: item?.headers
                  },
                  returnVar: {
                    vars: item?.vars
                  },
                  timer: {
                    delay: item?.delay
                  },
                  beanShellPre: {
                    script: [item?.beanShellPre]
                  },
                  beanShellPost: {
                    script: [item?.beanShellPost]
                  },
                  enabled: item?.enabled
                };
              }
              if (item?.apiType === 'JAVA') {
                return {
                  apiName: item?.apiName,
                  apiType: item?.apiType,
                  base: {
                    requestUrl: item?.requestUrl
                  },
                  param: {
                    params: item?.params
                  },
                  checkAssert: {
                    asserts: item?.asserts
                  },
                  enabled: item?.enabled
                };
              }
            })
          };
        }).filter((fItem, fK) => {
          if (fItem?.linkName) {
            return fItem;
          }
        });
       
        const csvs = action === 'edit' ? state?.details?.dataSource?.csvs : state?.csvs;
        const counters = action === 'edit' ? state?.details?.counters : state?.counters;      

        let globalHttp = {
          contentEncoding: values?.contentEncoding,
          domain: values?.domain,
          path: values?.path,
          port: values?.port,
          protocol: values?.protocol
        };

        if (action === 'edit' && (values?.contentEncoding || values?.domain || values?.path || values?.port ||  values?.protocol)) {
          globalHttp = {
            contentEncoding: values?.contentEncoding,
            domain: values?.domain,
            path: values?.path,
            port: values?.port,
            protocol: values?.protocol
          };
        } else {
          globalHttp = state?.details?.globalHttp;
        }

        const result = {
          globalHttp,
          counters,
          processName: values?.processName,
          links: newFormValues,
          dataSource: {
            csvs
          },
          globalHeader: {
            headers: values?.globalHeader
          },
          userVars: values?.userVars,
        };
       
        if (action === 'edit') {
          setState({
            loading: true
          });
          const msg = await BusinessFlowService.addPTS({ id, ...result });
          if (msg?.data?.success) {
            const res = await BusinessFlowService.debugPTS({ id });
            if (res?.data?.success) {
              router.push(`/businessFlow/debugDetail?id=${id}`);
              setState({
                loading: false
              });
              return;
            }
          } 
          setState({
            loading: false
          });
          return;
        } 
        setState({
          loading: true
        }); 
        const {
        data: { success, data }
      } = await BusinessFlowService.addPTS(result);
        if (success) {
          const res = await BusinessFlowService.debugPTS({ id: data?.id });
          if (res?.data?.success) {
            router.push(`/businessFlow/debugDetail?id=${data?.id}`);
            setState({
              loading: false
            });
            return;
          }
          setState({
            loading: false
          });
          return;
        } 
      }
    });
  };

  const handleOnlyDebug = async () => {
    const res = await BusinessFlowService.debugPTS({ id });
    if (res?.data?.success) {
      router.push(`/businessFlow/debugDetail?id=${id}`);
    }
  };
 
  const id = getUrlParams(window.location.href)?.id;
  const action = getUrlParams(window.location.href)?.action;

  useEffect(() => {
    if (action === 'edit') {
      queryPTSDetail();
    }
    queryFunctionList();
  }, []);
 
  const addNode = (type, linkIndex, defaultName?) => {
    let node = [];
    if (type === 'HTTP') {
      node = [{
        apiName: '',
        apiType: type,
        enabled: true,
        base: {
          allowForward: true,
          requestMethod: 'GET',
          requestTimeout: undefined,
          requestUrl: ''
        },
        body: {
          forms: [
            {
              key: '',
              value: ''
            }
          ],
          rawData: ''
        },
        checkAssert: {
          asserts: [
            {
              checkCondition: undefined,
              checkContent: undefined,
              checkObject: undefined,
              checkPointType: undefined,
            }
          ]
        },
        header: {
          headers: [
            {
              key: undefined,
              value: undefined
            }
          ]
        },
        returnVar: {
          vars: [
            {
              matchIndex: undefined,
              parseExpress: undefined,
              testName: undefined,
              varName: undefined,
              varSource: undefined
            }
          ]
        }
      }
      ];
    }
    if (type === 'JAVA') {
      node = [{
        apiName: '',
        apiType: type,
        enabled: true,
        base: {
          requestUrl: defaultName
        },
        param: {
          params: []
        },
        needRequest: true,
        checkAssert: {
          asserts: [
            {
              checkCondition: undefined,
              checkContent: undefined,
              checkObject: undefined,
              checkPointType: undefined
            }
          ]
        },
      }
      ];
    }
  
    if (action === 'edit') {
      const newLinks  = state?.details?.links?.map((item, k) => {
        if (k === linkIndex) {
          return {
            linkName: item?.linkName,
            linkType: item?.linkType,
            enabled: item?.enabled,
            apis: item?.apis?.concat(node)
          };
        }
        return item;
      });
  
      setState({
        details: {
          ...state?.details,
          links: newLinks
        }
      });
      return;
    }
    setState({
      apis: state?.apis?.concat(node)
    });
  };

  const addLink = () => {
    let linkNode = [];
    linkNode = [{ 
      linkName: '链路名称',
      linkType: 'normal',
      enabled: true,
      apis: [{
        apiName: '',
        apiType: 'HTTP',
        enabled: true,
        base: {
          allowForward: true,
          requestMethod: 'GET',
          requestTimeout: undefined,
          requestUrl: ''
        },
        body: {
          forms: [
            {
              key: '',
              value: ''
            }
          ],
          rawData: ''
        },
        checkAssert: {
          asserts: [
            {
              checkCondition: '',
              checkContent: '',
              checkObject: '',
              checkPointType: ''
            }
          ]
        },
        header: {
          headers: [
            {
              key: '',
              value: ''
            }
          ]
        },
        returnVar: {
          vars: [
            {
              matchIndex: 0,
              parseExpress: '',
              testName: '',
              varName: '',
              varSource: ''
            }
          ]
        }
      }
      ]
    }];
    if (action === 'edit') {
      setState({
        details: {
          ...state?.details,
          links: state?.details?.links?.concat(linkNode)
        }
      });
      return;
    }
    setState({
      links: state?.links?.concat(linkNode)
    });
  };

  function deleteIndexWithoutMutation(object, linksIndex) {
    const newObject = JSON.parse(JSON.stringify(object));
  
    if (
      newObject &&
      newObject.links 
    ) {
      newObject.links.splice(linksIndex, 1);
      return newObject;
    } 
    return object;
    
  }

  const handleDeleteLink = (linkIndex) => {
    if (action === 'edit') {
      setState({ details: deleteIndexWithoutMutation(state?.details, linkIndex) });
      return;
    }
    state?.links?.splice(linkIndex, 1);
    setState({
      links: state?.links
    });
  };

  const handleAddCsv = () => {
    const csv = [{
      fileName: '',
      ingoreFirstLine: true,
      params: ''
    }];
    if (action === 'edit') {
      setState({
        details: {
          ...state?.details,
          dataSource: {
            csvs: state?.details?.dataSource?.csvs?.concat(csv)
          },
        }
      });
      return;
    }
    setState({
      csvs: state?.csvs?.concat(csv)
    });
  };

  const handleAddCount = () => {
    const counter = [{
      end: '',
      format: '',
      incr: '',
      name: '',
      start: ''
    }];
    if (action === 'edit') {
      setState({
        details: {
          ...state?.details,
          counters: state?.details?.counters?.concat(counter)
        }
      });
      return;
    }
    setState({
      counters: state?.counters?.concat(counter)
    });
  };

  function handleMenuClick(e, linkIndex) {
    if (e.key === 'HTTP') {
      addNode('HTTP', linkIndex);
    }
    if (e.key === 'JAVA') {
      queryJavaRequestDetail(linkIndex);
    }
  }

  const menu = (linkIndex) => {

    return  <Menu onClick={(e) => handleMenuClick(e, linkIndex)}>
    <Menu.Item key="HTTP">
      HTTP压测节点
    </Menu.Item>
    <Menu.Item key="JAVA">
      IB2压测节点
    </Menu.Item>
  </Menu>;
  };

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
      });
      
    }
  };
   
  /**
   * @name 获取JavaRequest详情
   */
  const queryJavaRequestDetail = async (linkIndex) => {
    const {
          data: { success, data }
        } = await BusinessFlowService.queryJavaRequestDetail({
          javaType: 'IB2',   
        });
    if (success) {
      setState({
        javaRequestDetails: data,
      });
      addNode('JAVA', linkIndex, data?.className);
    }
  };

  /**
   * @name 获取函数列表
   */
  const queryFunctionList = async () => {
    const {
          data: { success, data }
        } = await BusinessFlowService.queryFunctionList({});
    if (success) {
      setState({
        functionList: data,
      });
    }
  };

  const handleClickFunctionList = () => { 
    setState({
      visible: true
    });
    queryFunctionList();
  };

  const handleSelectFunction = (value) => {
    setState({
      selectedFunction: value,
      functionExample: state?.functionList?.filter(item => { return item?.functionName === value; })?.[0]?.functionExample
    });
  };

  const handleCheck = async () => {
    const {
          data: { success, data }
        } = await BusinessFlowService.functionDebug({
          funcStr: state?.functionExample
        });
    if (success) {
      message.success(`校验成功,${data}`);
    }
  };

  /**
   * @name 复制
   */
  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  const renderLink = (linkNode, linkIndex) => {
    // tslint:disable-next-line:jsx-wrap-multiline
    return   <Form style={{ border: '1px solid #ddd', padding: '8px 16px', marginBottom: 20 }}>
    <Form layout="inline">
      <Form.Item >
        {getFieldDecorator(`${linkIndex}_linkName`, {
          initialValue: action === 'edit' ? linkNode?.linkName : '链路名称',
          rules: [{ required: true, message: '请输入链路!' }],
        })(<Input placeholder="请输入链路名称" />)}
      </Form.Item>
      <Form.Item >
        {getFieldDecorator(`${linkIndex}_linkType`, {
          initialValue: action === 'edit' ? linkNode?.linkType : 'normal',
          rules: [{ required: true, message: '请选择链路类型!' }],
        })(<CommonSelect 
            style={{ width: 160 }} 
            dataSource={[
              {
                label: '普通线程组',
                value: 'normal'
              },
              {
                label: 'setUp线程组',
                value: 'setUp'
              },
              {
                label: 'tearDown线程组',
                value: 'tearDown'
              }
            ]} />)}
      </Form.Item>
      <Form.Item >
        {getFieldDecorator(`${linkIndex}_enabled`, {
          valuePropName: 'checked',
          initialValue: action === 'edit' ? linkNode?.enabled : true,
          rules: [{ required: true, message: '' }],
        })(<Switch />)}
      </Form.Item>
      <Form.Item style={{ float: 'right' }}>
        <Button onClick={() => {handleDeleteLink(linkIndex); }} type="link">删除</Button>
      </Form.Item>
    </Form>
    {action === 'edit' ? linkNode?.apis?.map((formItem, index) => {
      if (formItem?.apiType === 'HTTP') {
        return <APIPanel key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
      }
      return <IB2Node key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
    }) : state?.apis?.map((formItem, index) => {
      if (formItem?.apiType === 'HTTP') {
        return <APIPanel key={index} form={form} index={index} api={formItem} setState={setState} state={state} linkIndex={linkIndex}/>;
      }
      return <IB2Node key={index} form={form} index={index} api={formItem} action={action} setState={setState} state={state} linkIndex={linkIndex}/>;
    })}
<div style={{ marginTop: 20 }}>
  <Dropdown.Button onClick={() => addNode('HTTP', linkIndex)} overlay={() =>  menu(linkIndex)}>
    添加压测节点
  </Dropdown.Button>
</div>
    </Form>;
  };

  return (
    <MainPageLayout>
      <div style={{ width: '100%', paddingBottom: 50 }}>
    <Form layout="inline">
      <Form.Item label="业务流程名称">
        {getFieldDecorator('processName', {
          initialValue: action === 'edit' ? state?.details?.processName : undefined,
          rules: [{ required: true, message: '请输入业务流程名称!' }],
        })(<Input placeholder="请输入业务流程名称" />)}
      </Form.Item>
      <Form.Item style={{ float: 'right' }}>
        <Button 
          onClick={() => {
            router.push('/businessFlow');
          }}
        >
          返回列表
        </Button>
      </Form.Item>
    </Form>
    <Tabs defaultActiveKey="1" type="card" style={{ paddingBottom: 50 }}>
  <TabPane tab="链路配置" key="1">
  <Collapse defaultActiveKey={['1']} style={{ marginBottom: 12 }}>
  <Panel header="全局配置" key="1" >
     <Tabs type="card">
  <TabPane tab="CSV数据" key="1">
  { action === 'edit' ? state?.details?.dataSource?.csvs?.map((item, k) => {
    return <CsvForm 
      onChange={(result) => {
        setState({
          details: result
        });
      }} 
      value={item} 
      key={k} 
      action={action} 
      index={k}  
      state={state}
    />;
  }) : state?.csvs?.map((ite, k1) => {
    return <CsvForm
      onChange={(result) => {
        setState({
          csvs: result
        });
      }} 
      value={ite} 
      key={k1} 
      action={action} 
      index={k1} 
      state={state}
    />;
  })}
    <Button onClick={() => { handleAddCsv(); }}>添加CSV数据</Button>
  </TabPane>
  <TabPane tab="http信息头" key="2">
  <Form>
  <Form.Item >
        {getFieldDecorator('globalHeader', {
          initialValue: action === 'edit' ? state?.details?.globalHeader?.headers : [],
          rules: [{ required: false, message: '请输入!' }],
        })(<GlobalHeaderTable />)}
      </Form.Item>
  </Form>
  </TabPane>
  <TabPane tab="http请求" key="3">
        <GlobalHttp 
          onChange={action === 'edit' ? (result) => {
            setState({
              details: result
            });
          } : (result) => {
            setState({
              globalHttp: result
            });
          }} 
          value={action === 'edit' ? state?.details?.globalHttp : state?.globalHttp}
          action={action}
        />
  </TabPane>
  <TabPane tab="用户变量" key="4">
  <Form>
  <Form.Item >
        {getFieldDecorator('userVars', {
          initialValue: action === 'edit' ? state?.details?.userVars : [],
          rules: [{ required: false, message: '请输入!' }],
        })(<GlobalHeaderTable/>)}
      </Form.Item>
  </Form>
  </TabPane>
  <TabPane tab="计数器" key="5">
  { action === 'edit' ? state?.details?.counters?.map((item, k) => {
    return <CountForm 
      onChange={(result) => {
        setState({
          details: result
        });
      }}  
      value={item} 
      key={k} 
      action={action} 
      index={k} 
      state={state}
    />;
  }) : state?.counters?.map((ite, k1) => {
    return <CountForm 
      onChange={(result) => {
        setState({
          counters: result
        });
      }}  
      value={ite} 
      key={k1} 
      action={action} 
      index={k1} 
      state={state}
    />;
  })}
    <Button onClick={() => { handleAddCount(); }}>添加计数器</Button>
  </TabPane>
</Tabs>
  </Panel>
</Collapse>  
  </TabPane>
</Tabs>

{action === 'edit' && state?.details?.links ? state?.details?.links?.map((item, k) => {
  return renderLink(item, k); 
}) : state?.links?.map((item1, k1) => {
  return renderLink(item1, k1);
})
  }
      <div style={{ marginTop: 20 }}>
        <Button 
          onClick={() => {
            addLink();
          }} >
          + 添加串联链路
        </Button>
      </div>
      <Modal 
        onCancel={() => {
          setState({
            visible: false
          });
        }} 
        title="函数列表" 
        visible={state?.visible} 
        width={'80%'} 
        footer={null}>
        <div style={{ minHeight: 300, maxHeight: 500, overflow: 'scroll' }}>
          <CommonSelect
            onChange={handleSelectFunction}
            placeholder="请选择函数"
            style={{ width: '100%' }}
            dataSource={state?.functionList} 
            onRender={item => (
              <CommonSelect.Option key={item.functionName} value={item.functionName}>
               {item?.functionName}:{item.functionDesc}
              </CommonSelect.Option>
            )} 
          />
          {state?.functionExample && <div>
          <h5 style={{ marginTop: 12 }}>函数参数说明</h5>
          <Table 
            rowKey="param"
            pagination={false}
            size="small"
            dataSource={state?.functionList?.filter(item => {return item?.functionName === state?.selectedFunction; })?.[0]?.functionParams}
            columns={[{
              title: '参数',
              dataIndex: 'param',
            },
              {
                title: '参数说明',
                dataIndex: 'describe',
              },
              {
                title: '是否必填',
                dataIndex: 'required',
                render: (text) => {
                  return  text ? '是' : '否';
                }
              },
            ]}
          />
          <h5 style={{ marginTop: 12 }}>函数表达式</h5>
          <Input 
            value={state?.functionExample} 
            onChange={(e) => {
              setState({
                functionExample: e?.target?.value
              });
            }}
          />
          <div style={{ marginTop: 12 }}>
            <Button onClick={handleCheck}>校验</Button>
            <Button onClick={() => { handleCopy(state?.functionExample); }} style={{ marginLeft: 8 }}>复制函数表达式</Button>
          </div>
          </div>}
         
        </div>
        
      </Modal>
<div style={{ position: 'fixed', bottom: 0, padding: 8, background: '#fff', width: '100%' }}>
    <Button loading={state?.loading} type="primary" onClick={handleDebug} style={{ marginRight: 8 }}>
      保存并调试
    </Button>
    <Button loading={state?.loading} type="primary" onClick={handleSubmit}>
      仅保存
    </Button>
    <Button 
      style={{ marginLeft: 20 }} 
      onClick={() => {
        handleClickFunctionList();
      }}>
        查看函数表达式
      </Button>

    {/* {action === 'edit' && <Button type="primary" onClick={handleOnlyDebug} style={{ marginLeft: 8 }}>
      仅调试
    </Button>} */}
   
    </div>
    </div>
   
    </MainPageLayout>
  );
};

const WrappedMultiForm = Form.create({ name: 'multi_form' })(MultiFormComponent);
export default WrappedMultiForm;
