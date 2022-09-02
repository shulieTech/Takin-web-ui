import React, { useState, useEffect } from 'react';
import { Modal, Icon, Form, Input, message, Spin, Tooltip } from 'antd';
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
  const { cancelCallback, canEditLink = true, form } = props;
  const { getFieldDecorator, validateFields } = form;
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(props.detail);

  const getDetail = async () => {
    setLoading(true);
    const {
      data: { success, data },
    } = await service.getLinkDetail({ id: props.detail.id }).finally(() => {
      setLoading(false);
    });
    if (success) {
      setDetail({
        ...props.detail,
        ...data,
      });
    }
  };

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

  useEffect(() => {
    if (props.detail?.id) {
      getDetail();
    }
  }, [props.detail?.id]);

  return (
    <Modal
      title="链路编辑"
      visible={!!props.detail}
      onCancel={cancelCallback}
      onOk={handleSubmit}
      okText="保存"
      okButtonProps={{
        disabled: loading,
      }}
      width={canEditLink ? 1180 : 630}
    >
      <Spin spinning={loading}>
        <Form>
          <Form.Item label="链路名称">
            {getFieldDecorator('name', {
              initialValue: detail?.name,
              rules: [
                { required: true, whitespace: true, message: '请输入链路名称' },
              ],
            })(
              <Input
                placeholder="请输入"
                maxLength={25}
                style={{ width: 470 }}
              />
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
              ? getFieldDecorator('detailInputs', {
                initialValue: detail?.detailInputs,
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
              : (detail?.detailInputs || []).map((x) => {
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
                          {x.method}
                        </span>
                        <div className="truncate" style={{ flex: 1 }}>
                          {x.entranceName || '-'}
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
                        {x.entranceUrl || '-'}
                      </div>
                    </div>
                  </div>
                );
              })}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create()(EditLinkModal);
