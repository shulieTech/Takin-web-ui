/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { Form, Input, Button, Tabs, Collapse,  message, Modal, Table } from 'antd';
import { MainPageLayout } from 'src/components/page-layout';
import {  CommonSelect, useStateReducer } from 'racc';
import BusinessFlowService from './service';
import router from 'umi/router';
import { getUrlParams } from 'src/utils/utils';
import CsvForm from './components/CsvForm';
import GlobalHeaderTable from './components/GlobalHeaderTable';
import GlobalHttp from './components/GlobalHttp';
import CountForm from './components/CountForm';
import copy from 'copy-to-clipboard';
import LinkItem from './components/LinkItem';

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
  },
  globalHeader: {
    headers: []
  },
  userVars: []
});
export type State = ReturnType<typeof getInitState>;
const MultiFormComponent = ({ form }) => {
  const { getFieldDecorator, validateFields } = form;
  const id = getUrlParams(window.location.href)?.id;
  const action = getUrlParams(window.location.href)?.action;
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const [state, setState] = useStateReducer(getInitState());

  useEffect(() => {
    if (action === 'edit') {
      queryPTSDetail();
    }
    queryFunctionList();
  }, []);

  const handleSubmit = async () => {
    await validateFields(async (err, values) => {
      if (!err) {
        const csvs = action === 'edit' ? state?.details?.dataSource?.csvs : state?.csvs;
        const counters = action === 'edit' ? state?.details?.counters : state?.counters;
        const globalHttp = action === 'edit' ? state?.details?.globalHttp : state?.globalHttp;
        const links = action === 'edit' ? state?.details?.links : state?.links;
        const globalHeader = action === 'edit' ? state?.details?.globalHeader : state?.globalHeader;
        const userVars = action === 'edit' ? state?.details?.userVars : state?.userVars;

        const result = {
          globalHttp,
          counters,
          globalHeader,
          links,
          userVars,
          processName: values?.processName,
          dataSource: {
            csvs
          },
        };
        console.log('resiult', result);
           
      //   if (action === 'edit') {
      //     setState({
      //       loading: true
      //     });
      //     const msg = await BusinessFlowService.addPTS({ id, ...result });
      //     if (msg?.data?.success) {
      //       message.success('保存成功');
      //       router.push('/businessFlow');
      //       setState({
      //         loading: false
      //       });
      //       return;
      //     } 
      //     setState({
      //       loading: false
      //     });
      //     return;
      //   } 
      //   setState({
      //     loading: true
      //   }); 
      //   const {
      //   data: { success, data }
      // } = await BusinessFlowService.addPTS(result);
      //   if (success) {
      //     setState({
      //       loading: false
      //     });
      //     message.success('保存成功');
      //     router.push('/businessFlow');
      //     return;
      //   } 
      //   setState({
      //     loading: false
      //   });
      }
    });
  };

  const handleDebug = async () => {
    validateFields(async (err, values) => {
      if (!err) {
        const csvs = action === 'edit' ? state?.details?.dataSource?.csvs : state?.csvs;
        const counters = action === 'edit' ? state?.details?.counters : state?.counters;
        const globalHttp = action === 'edit' ? state?.details?.globalHttp : state?.globalHttp;
        const links = action === 'edit' ? state?.details?.links : state?.links;
        const globalHeader = action === 'edit' ? state?.details?.globalHeader : state?.globalHeader;
        const userVars = action === 'edit' ? state?.details?.userVars : state?.userVars;

        const result = {
          globalHttp,
          counters,
          globalHeader,
          links,
          userVars,
          processName: values?.processName,
          dataSource: {
            csvs
          },
        };
        console.log('resiult', result);
       
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
        <GlobalHeaderTable 
          value={action === 'edit' ? state?.details?.globalHeader?.headers : state?.globalHeader?.headers}
          onChange={action === 'edit' ? (result) => {
            setState({
              details: {
                ...state?.details,
                globalHeader: {
                  headers: result
                }
              }
            });
          } : (result) => {
            setState({
              globalHeader: {
                headers: result
              }
            });
          }}
        />
      </Form.Item>
  </Form>
  </TabPane>
  <TabPane tab="http请求" key="3">
        <GlobalHttp 
          onChange={action === 'edit' ? (result) => {
            setState({
              details: {
                ...state?.details,
                globalHttp: result?.globalHttp
              }
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
        <GlobalHeaderTable
          value={action === 'edit' ? state?.details?.userVars : state?.userVars}
          onChange={action === 'edit' ? (result) => {
            setState({
              details: {
                ...state?.details,
                userVars: result
              }
            });
          } : (result) => {
            setState({
              userVars: result
            });
          }} 
        />
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

{action === 'edit' ? state?.details?.links?.map((item, k) => {
  return <LinkItem
           onChange={(result) => {
             setState({
               details: result
             });
           }}  
           action={action} 
           form={form}
           key={k}
           value={item} 
           state={state}
           linkIndex={k}
        />; 
}) : state?.links?.map((item1, k1) => {
  return <LinkItem
          onChange={(result) => {
            setState({
              links: result
            });
          }}  
          action={action} 
          form={form}
          key={k1}
          value={item1} 
          state={state}
          linkIndex={k1}
        />;
})
  }
      <div style={{ marginTop: 20 }}>
        <Button 
          onClick={() => {
            addLink();
          }} 
        >
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
