import React, { useState, useEffect } from 'react';
import { Modal, Form, Radio, Select, Alert, Spin, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import service from '../service';
import useListService from 'src/utils/useListService';
import { LINK_STATUS } from '../constants';
import { connect } from 'dva';

const { Option } = Select;

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
  form?: WrappedFormUtils;
  envList?: any[];
}

const SyncLink = (props: Props) => {
  const { detail, okCallback, cancelCallback, form, envList } = props;
  const { getFieldDecorator, validateFields } = form;
  const otherEnvList = envList.filter(
    (x) => x.envCode !== localStorage.getItem('env-code')
  );

  const startSync = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const {
        data: { success },
      } = await service.syncLink({
        id: detail.id,
        ...values,
      });
      if (success) {
        message.success('操作成功');
        okCallback();
      }
    });
  };

  return (
    <Spin spinning={false}>
      <Modal
        visible
        title="同步配置"
        onCancel={cancelCallback}
        onOk={startSync}
      >
        {detail.status !== LINK_STATUS[2] && (
          <Alert
            message="当前链路准备资源配置未完成，请谨慎同步！"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Form>
          <Form.Item label="将压测配置同步到以下环境：">
            {getFieldDecorator('targetEnv', {
              rules: [{ required: true, message: '请选择目标环境' }],
              initialValue: otherEnvList?.[0]?.envCode,
            })(
              <Radio.Group>
                {otherEnvList.map((x) => (
                  <Radio value={x.envCode} key={x.envCode}>
                    {x.envName}
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="选择链路">
            {getFieldDecorator('linkId', {
              rules: [{ required: true, message: '请选择链路' }],
            })(
              <Select placeholder="请选择">
                <Option value={1}>链路1</Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default connect(({ common }) => ({ ...common }))(
  Form.create()(SyncLink)
);
