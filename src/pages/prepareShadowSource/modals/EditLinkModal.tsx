import React, { useState, useEffect } from 'react';
import {
  Modal,
  Icon,
  Form,
  Input,
  message,
  Spin,
  Tooltip,
  Upload,
  Button,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import styles from '../index.less';
import classNames from 'classnames';
import service from '../service';
import LinkFilter from '../components/LinkFilter';
import { ImportFile } from 'racc';

interface EditLinkModalProps {
  form?: WrappedFormUtils;
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}
const EditLinkModal = (props: EditLinkModalProps) => {
  const { okCallback, cancelCallback, form } = props;
  const { getFieldDecorator, validateFields } = form;
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(props.detail);

  const canEditLink = props?.detail?.type === 0 || !props?.detail?.id; // 手动新增的才可编辑

  const getDetail = async () => {
    setLoading(true);
    const {
      data: { success, data },
    } = await service.getLinkDetail({ id: props.detail?.id }).finally(() => {
      setLoading(false);
    });
    if (success) {
      setDetail({
        ...props.detail,
        ...data,
      });
    }
  };

  const uploadFile = (options) => {
    // TODO 上传文件
    const { file } = options;

  };

  const handleSubmit = () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const {
        data: { success },
      } = await service[detail?.id ? 'updateLink' : 'addLink']({
        ...detail,
        ...values,
      });
      if (success) {
        message.success('操作成功');
        okCallback();
      }
    });
  };

  useEffect(() => {
    if (props.detail?.id) {
      getDetail();
    } else {
      setDetail(props.detail);
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
      destroyOnClose
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
                <Tooltip title="选择链路中涉及的入口url">
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
          <Form.Item label="关联脚本">
            {getFieldDecorator('scriptFile', {
              valuePropName: 'fileList',
              getValueFromEvent: (e) => {
                if (Array.isArray(e)) {
                  return e;
                }
                return e && e.fileList;
              },
              // initialValue: 
            })(
              <Upload customRequest={uploadFile}>
                <Button>
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Form.create()(EditLinkModal);
