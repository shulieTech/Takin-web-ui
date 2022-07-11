import React, { useState } from 'react';
import { message, Input, Modal, Form } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import service from '../service';

const FormItem = Form.Item;

interface Props {
  editItem: any;
  okCallback: () => void;
  cancelCallback: () => void;
  form: WrappedFormUtils;
}

const EditMachineModal: React.FC<Props> = (props) => {
  const {
    form: { getFieldDecorator, validateFields },
    editItem,
    okCallback,
    cancelCallback,
    ...rest
  } = props;

  const isEdit = !!editItem?.name; //  没有id，使用name为标识

  const [saving, setSaving] = useState(false);

  const saveItem = async () => {
    validateFields(async (err, values) => {
      if (err) {
        return;
      }
      setSaving(true);
      const {
        data: { success },
      } = await service[isEdit ? 'machineUpdate' : 'machineAdd']({
        ...editItem,
        ...values,
      }).finally(() => {
        setSaving(false);
      });
      if (success) {
        message.success('操作成功');
        okCallback();
      }
    });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  return (
    <Modal
      title={`${isEdit ? '编辑' : '新增'}测试机器`}
      visible={!!editItem}
      destroyOnClose
      onOk={saveItem}
      onCancel={cancelCallback}
      okButtonProps={{
        loading: saving,
      }}
      {...rest}
    >
      <Form>
        <FormItem label="机器名称" {...formItemLayout}>
          {getFieldDecorator(isEdit ? 'updateName' : 'name', {
            initialValue: editItem?.name,
            rules: [
              { required: true, whitespace: true, message: '请输入机器名称' },
            ],
          })(<Input placeholder="示例：压力机1" maxLength={30} />)}
        </FormItem>
        <FormItem label="机器IP" {...formItemLayout}>
          {getFieldDecorator('ip', {
            initialValue: editItem?.ip,
            rules: [
              { required: true, whitespace: true, message: '请输入机器IP' },
              {
                pattern:
                  /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
                message: '请输入正确格式的IP地址',
              },
            ],
          })(<Input placeholder="示例：192.168.8.8" maxLength={30} />)}
        </FormItem>
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: editItem?.username,
            rules: [
              { required: true, whitespace: true, message: '请输入用户名' },
            ],
          })(
            <Input placeholder="需root权限" maxLength={30} autoComplete="new-password" />
          )}
        </FormItem>
        <FormItem label="密码" {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: editItem?.password,
            rules: [{ required: true, whitespace: true, message: '请输入密码' }],
          })(
            <Input
              placeholder="请输入"
              maxLength={100}
              type="password"
              autoComplete="new-password"
            />
          )}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create()(EditMachineModal);
