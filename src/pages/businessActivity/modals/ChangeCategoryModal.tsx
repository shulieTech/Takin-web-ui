import React, { useState, useEffect } from 'react';
import { Modal, Form, Spin, message, Button } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import CategoryTreeSelect from '../components/CategoryTreeSelect';
import service from '../service';

const FormItem = Form.Item;

interface Props {
  form: WrappedFormUtils;
  record: {
    activityId: number | string;
    activityName: string;
  };
  okCallback: () => void;
}

/**
 * 移动业务活动，其实本质是更新业务活动
 * @param props 
 * @returns 
 */
const ChangeCategoryModal = (props: Props) => {
  const {
    record,
    form: { getFieldDecorator, validateFields },
    okCallback,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState({
    category: 0,
  });

  const getDetail = async () => {
    setLoading(true);
    const {
      data: { success, data },
    } = await service
      .getBusinessActivityDetails({
        activityId: record.activityId,
      })
      .finally(() => {
        setLoading(false);
      });
    if (success) {
      setDetail(data);
    }
  };

  const handleSubmit = () => {
    validateFields(async (error, values) => {
      if (error) {
        return;
      }
      setSaving(true);
      const {
        data: { success },
      } = await service
        .updateSystemProcess({
          ...detail,
          ...values,
          applicationId: detail.applicationName,
          value: detail.linkId,
        })
        .finally(() => {
          setSaving(false);
        });
      if (success) {
        message.success('操作成功');
        setVisible(false);
        okCallback();
      }
    });
  };

  useEffect(() => {
    if (visible) {
      getDetail();
    }
  }, [visible]);

  return (
    <>
      <Button
        type="link"
        style={{ marginLeft: 8 }}
        onClick={() => setVisible(true)}
      >
        移动
      </Button>
      <Modal
        title={`移动“${record.activityName}”到文件夹`}
        visible={visible}
        destroyOnClose
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        okButtonProps={{
          loading: saving,
          disabled: loading,
        }}
        maskClosable={false}
        {...rest}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem>
              {getFieldDecorator('category', {
                initialValue: detail?.category || 0,
              })(<CategoryTreeSelect treeDefaultExpandAll/>)}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default Form.create()(ChangeCategoryModal);
