import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  Icon,
  Modal,
  Spin,
  Dropdown,
  Button,
  Radio as AntRadio,
  message,
} from 'antd';
import {
  Form,
  FormItem,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Radio, Input, NumberPicker } from '@formily/antd-components';
import useListService from 'src/utils/useListService';
import service from '../service';
import { PrepareContext } from '../indexPage';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

export default (props: Props) => {
  const { detail, okCallback, cancelCallback, ...rest } = props;
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const actions = useMemo(createAsyncFormActions, []);
  const [selectedTplIndex, setSelectedTplIndex] = useState(0);
  const [showTplDropDown, setShowTplDropDown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState();
  const [testing, setTesting] = useState(false);
  const [type, setType] = useState(detail?.type || 1);
  const [avgRt, setAvgRt] = useState(0);
  let mockObj = detail.mockInfo || {};
  try {
    mockObj = JSON.parse(detail.mockReturnValue);
  } catch (error) {
    mockObj = detail.mockInfo || {};
  }
  
  const getAvgRt = async (id) => {
    const {
      data: { success, data },
    } = await service.getAvgRt({ id });
    if (success) {
      setAvgRt(data);
    }
  };

  // const {
  //   list,
  //   getList,
  //   loading,
  // } = useListService({
  //   service: service.mockTplList,
  //   defaultQuery: {
  //     current: 0,
  //     pageSize: 10,
  //   },
  // });

  const list = [
    `{\n\t"name1":"测试角色",\n\t"permissionValue":"test_role",\n\t"enabled":true,\n\t"remark":"这是一个测试使用的角色",\n\t"clientToken":"hyc11bzqcjdra4fg",\n\t"psId":"hU2czV4pMR"\n}`,
    `{\n\t"name2":"测试角色",\n\t"permissionValue":"test_role",\n\t"enabled":true,\n\t"remark":"这是一个测试使用的角色",\n\t"clientToken":"hyc11bzqcjdra4fg",\n\t"psId":"hU2czV4pMR"\n}`,
  ];

  const handleSubmit = async () => {
    const { values } = await actions.submit();
    const newValue = {
      ...detail,
      mockInfo: {
        ...mockObj,
        ...values,
      },
    };
    const {
      data: { success },
    } = await service.updateRemoteCall(newValue);
    if (success) {
      message.success('操作成功');
      okCallback();
    }
  };

  const chooseTpl = () => {
    actions.setFieldValue('mockValue', list[selectedTplIndex]);
    setShowTplDropDown(false);
  };

  const formEffects = () => {
    const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks;
    onFieldValueChange$('type').subscribe(({ value }) => {
      setType(value);
    });
    onFieldInputChange$('type').subscribe(({ value }) => {
      actions.setFieldState('mockValue', (state) => {
        state.value = undefined;
      });
    });
  };

  const placeholder =
    {
      0: '请在左侧选择Json格式模版，示例：\n{\n\t"name":"测试角色",\n\t"permissionValue":"test_role",\n\t"enabled":true,\n\t"remark":"这是一个测试使用的角色",\n\t"clientToken":"hyc11bzqcjdra4fg",\n\t"psId":"hU2czV4pMR"\n}',
      1: `返回结果数据示例：\nimport  com.example.demo.entity.User ;\nUser user = new User();\nuser.setName("挡板");\nreturn user ;`,
    }[type] || '请输入';

  useEffect(() => {
    if (detail?.id) {
      getAvgRt(detail.id);
    }
  }, [detail?.id]);

  return (
    <Modal
      title="Mock配置"
      width={1000}
      visible={!!detail}
      onOk={handleSubmit}
      okText="保存"
      okButtonProps={{
        disabled: loading,
      }}
      onCancel={cancelCallback}
      maskClosable={false}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
      destroyOnClose
      {...rest}
    >
      <Spin spinning={loading}>
        <Form
          actions={actions}
          initialValues={mockObj || {}}
          labelCol={4}
          wrapperCol={18}
          effects={formEffects}
        >
          <FormItem
            name="type"
            title="类型"
            component={Radio.Group}
            dataSource={[
              { label: 'Json格式', value: '0' },
              { label: '脚本格式', value: '1' },
            ]}
            rules={[{ required: true, message: '请选择类型' }]}
            initialValue={0}
          />
          {list?.length > 0 && type === '0' && (
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  bottom: -60,
                  left: 94,
                  zIndex: 1,
                }}
              >
                <Dropdown
                  visible={showTplDropDown}
                  overlay={
                    <div
                      style={{
                        backgroundColor: '#fff',
                        boxShadow:
                          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
                        border: '1px solid var(--Netural-300, #DBDFE3)',
                        borderRadius: 4,
                        width: 545,
                        height: 300,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                        }}
                      >
                        <div>
                          <AntRadio.Group
                            onChange={(e) =>
                              setSelectedTplIndex(e.target.value)
                            }
                            value={selectedTplIndex}
                          >
                            {list.map((x, i) => (
                              <div
                                style={{
                                  padding: 16,
                                  borderBottom:
                                    '1px solid var(--Netural-75, #F7F8FA)',
                                }}
                              >
                                <AntRadio value={i}>模板{i + 1}</AntRadio>
                              </div>
                            ))}
                          </AntRadio.Group>
                        </div>
                        <div
                          style={{
                            margin: 24,
                            padding: 16,
                            height: 200,
                            flex: 1,
                            overflow: 'auto',
                            border: '1px solid var(--Netural-75, #F7F8FA)',
                            borderRadius: 4,
                            color: 'var(--Netural-850, #414548)',
                            lineHeight: '20px',
                            fontWeight: 600,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {list[selectedTplIndex]}
                        </div>
                      </div>
                      <div style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <span>
                          <span
                            style={{
                              marginRight: 24,
                              color: 'var(--Netural-700, #6F7479)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setShowTplDropDown(false)}
                          >
                            取消
                          </span>
                          <a onClick={chooseTpl}>确认选择</a>
                        </span>
                      </div>
                    </div>
                  }
                >
                  <a onClick={() => setShowTplDropDown(true)}>选择模板</a>
                </Dropdown>
              </div>
            </div>
          )}
          <FormItem
            name="mockValue"
            title={<span style={{ position: 'relative' }}>Mock数据</span>}
            component={Input.TextArea}
            rules={[
              { required: true, whitespace: true, message: '请输入Mock数据' },
            ]}
            props={{
              placeholder,
              rows: 10,
            }}
          />

          <div style={{ paddingLeft: '16.7%', marginBottom: 24 }}>
            <Button
              style={{ marginRight: 16 }}
              type="primary"
              ghost
              loading={testing}
            >
              检测格式
            </Button>
            <span
              style={{
                color: 'var(--BrandPrimary, #11BBD5)',
              }}
            >
              <Icon
                type="info-circle"
                theme="filled"
                style={{ marginRight: 8 }}
              />
              检测成功
            </span>
            <span
              style={{
                color: 'var(--FunctionNegative-500, #D24D40)',
              }}
            >
              <Icon
                type="close-circle"
                theme="filled"
                style={{ marginRight: 8 }}
              />
              检测失败：原因
            </span>
          </div>
          <FormItem name="layout_3" label="返回响应时间">
            <div style={{ display: 'flex' }}>
              <FormItem
                name="responseTime"
                component={NumberPicker}
                props={{ placeholder: '请输入', min: 0, precision: 0 }}
                initialValue={100}
                rules={[{ required: true, message: '请输入返回响应时间' }]}
              />
              <span style={{ marginLeft: 8, marginRight: 16 }}>ms</span>
              {avgRt > 0 && (
                <span
                  style={{
                    color: 'var(--Netural-600, #90959A)',
                  }}
                >
                  历史相应时间参考：平均{avgRt} ms
                </span>
              )}
            </div>
          </FormItem>
        </Form>
      </Spin>
    </Modal>
  );
};
