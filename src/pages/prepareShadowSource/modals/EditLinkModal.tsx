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
  canEditLink: boolean;
}
const EditLinkModal = (props: EditLinkModalProps) => {
  const { detail, cancelCallback, canEditLink = true, form } = props;
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
      width={canEditLink ? 1180 : 630}
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
          {canEditLink
            ? getFieldDecorator('links', {
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
            })(<LinkFilter />)
            : [1, 2].map((x) => {
              return (
                  <div style={{ marginBottom: 16 }} key={x}>
                    <div style={{ lineHeight: 1.5 }}>
                      <div style={{ display: 'flex' }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--Netural-900, #303336)',
                            fontWeight: 700,
                            marginRight: 12,
                          }}
                        >
                          GET
                        </span>
                        <div className="truncate" style={{ flex: 1 }}>
                          撤回消息
                        </div>
                      </div>
                      <div
                        className="truncate"
                        style={{
                          fontSize: 12,
                          color: 'var(--Netural-600, #90959A)',
                          marginRight: 12,
                          cursor: 'pointer',
                        }}
                      >
                        https://ip:port/uentrance/interf/issue/query
                      </div>
                    </div>
                  </div>
              );
            })}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditLinkModal);
