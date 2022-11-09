import React from 'react';
import { Modal, Table } from 'antd';
import service from '../service';
import {
  Form,
  FormItem,
  createAsyncFormActions,
  FormItemDeepProvider as FormLayout,
  FieldList,
} from '@formily/antd';
import { Select, NumberPicker, DatePicker } from '@formily/antd-components';
import styles from '../index.less';

interface Props {
  detail: any;
  cancelCallback: () => void;
  okCallback: () => void;
}
export default (props: Props) => {
  const { detail, cancelCallback, okCallback } = props;
  const actions = createAsyncFormActions();

  const handleSubmit = async () => {
    const { values } = await actions.submit();
    // TODO 提交数据
    okCallback();
  };
  return (
    <Modal
      title="发压机资源定制"
      visible
      width={600}
      onOk={handleSubmit}
      onCancel={cancelCallback}
      bodyStyle={{
        maxHeight: '60vh',
        overflow: 'auto',
      }}
    >
      <Form
        labelCol={5}
        wrapperCol={18}
        actions={actions}
        initialValues={detail}
      >
        <FormItem
          name="layout_1"
          label={
            <span>
              <span style={{ color: 'red' }}>*</span> 使用时长
            </span>
          }
          itemStyle={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex' }}>
            <FormItem
              name="time"
              component={NumberPicker}
              itemStyle={{
                marginBottom: 0,
                flex: 1,
              }}
              props={{
                placeholder: '请输入',
                style: {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  width: '100%',
                },
                min: 1,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入使用时长',
                  format: 'integer',
                },
              ]}
            />
            <FormItem
              name="timeUnit"
              component={Select}
              props={{
                style: {
                  width: 50,
                },
                className: styles['no-border-select'],
              }}
              dataSource={[
                { label: '小时', value: 1 },
                { label: '分钟', value: 2 },
              ]}
              initialValue={1}
            />
          </div>
        </FormItem>
        <FormItem
          name="layout_2"
          label={
            <span>
              <span style={{ color: 'red' }}>*</span> 最大并发
            </span>
          }
          itemStyle={{ marginBottom: 0 }}
        >
          <div style={{ display: 'flex' }}>
            <FormItem
              name="maxCount"
              component={NumberPicker}
              itemStyle={{
                flex: 1,
              }}
              props={{
                placeholder: '请输入',
                style: {
                  width: '100%',
                },
                min: 1,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入使用时长',
                  format: 'integer',
                },
              ]}
            />
            <div>
              <span style={{ marginLeft: 8, marginRight: 16 }}>
                预估总IP数：0
              </span>
              预估消耗总流量为：0
            </div>
          </div>
        </FormItem>
        <FormItem
          label={
            <span>
              <span style={{ color: 'red' }}>*</span> 机器分布
            </span>
          }
          name="machinesLayout"
        >
          <FieldList
            name="machines"
            initialValue={[{}]}
            rules={[{ required: true, message: '请选择地区' }]}
          >
            {({ state, mutators }) => {
              const columns = [
                {
                  title: '地区',
                  render: (text, record, index) => {
                    return (
                      <FormItem
                        name={`machines.${index}.area`}
                        component={Select}
                        dataSource={[{ label: '华东1', value: 1 }]}
                        props={{
                          placeholder: '请选择地区',
                        }}
                        rules={[{ required: true, message: '请选择地区' }]}
                      />
                    );
                  },
                },
                {
                  title: '数目',
                  render: (text, record, index) => {
                    return (
                      <FormItem
                        name={`machines.${index}.num`}
                        component={NumberPicker}
                        props={{
                          placeholder: '请输入数目',
                          min: 1,
                        }}
                        rules={[
                          {
                            required: true,
                            message: '请输入数目',
                            format: 'integer',
                          },
                        ]}
                      />
                    );
                  },
                },
                {
                  title: '操作',
                  render: (text, record, index) => {
                    return (
                      <span
                        style={{
                          display: 'inline-block',
                          marginBottom: 24,
                        }}
                      >
                        {state.value?.length === 1 && index === 0 ? (
                          '-'
                        ) : (
                          <a onClick={() => mutators.remove(index)}>删除</a>
                        )}
                      </span>
                    );
                  },
                },
              ];
              return (
                <Table
                  size="small"
                  pagination={false}
                  dataSource={state.value}
                  columns={columns}
                  footer={() => <a onClick={() => mutators.push({})}>新增</a>}
                />
              );
            }}
          </FieldList>
        </FormItem>
        <FormItem
          name="startTime"
          label="开始使用时间"
          component={DatePicker}
          props={{
            placeholder: '请选择日期和时间',
            showTime: true,
          }}
          rules={[{ required: true, message: '请选择日期和时间' }]}
        />
      </Form>
    </Modal>
  );
};
