import React, { useState, useEffect } from 'react';
import { Modal, Icon, Form, Input, message, Transfer, Tooltip } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from '../index.less';
import classNames from 'classnames';
import service from '../service';
import LinkFilter from '../components/LinkFilter';

interface EditLinkModalProps {
  form?: WrappedFormUtils;
  detail: any;
  cancelCallback: () => void;
}
const EditLinkModal = (props: EditLinkModalProps) => {
  const { detail, cancelCallback, form } = props;
  const { getFieldDecorator, validateFields } = form;

  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const {
        data: { success },
      } = await service.addLink({
        ...values,
      });
      if (success) {
        message.success('操作成功');
        cancelCallback();
        // TODO 刷新列表
      }
    });
  };
  return (
    <Modal
      title="链路编辑"
      visible={!!detail}
      onCancel={cancelCallback}
      onOk={handleSubmit}
      okText="保存"
      width={1180}
    >
      <Form>
        <Form.Item label="链路名称">
          {getFieldDecorator('title', {
            initialValue: detail?.title,
            rules: [
              { required: true, whitespace: true, message: '请输入链路名称' },
            ],
          })(
            <Input placeholder="请输入" maxLength={25} style={{ width: 470 }} />
          )}
        </Form.Item>
        <Form.Item
          label={
            <span>
              链路串联
              <Tooltip title="222">
                <Icon
                  type="info-circle"
                  style={{ cursor: 'pointer', marginLeft: 4 }}
                />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('links', {
            initialValue: detail?.links,
            rules: [
              {
                validator: (rule, val, callback) => {
                  if (Array.isArray(val) && val.length > 0) {
                    callback();
                  } else {
                    callback('请选择链路');
                  }
                },
              },
            ],
          })(<LinkFilter />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditLinkModal);
