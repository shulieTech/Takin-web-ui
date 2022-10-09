import React, { useState, useEffect, useContext } from 'react';
import {
  Icon,
  Button,
  Tooltip,
  InputNumber,
  Form,
  message,
  Modal,
  Table,
} from 'antd';
import service from '../service';
import NodeDetailModal from '../modals/NodeDetail';

interface Props {
  record: any;
  editable?: boolean;
  okCallback: () => void;
}

const EditAgentCount = (prop: Props) => {
  const { record, okCallback, editable = true, form } = prop;
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorStr, setErrorStr] = useState('');
  const [detail, setDetail] = useState();

  const saveAgentCount = () => {
    form.validateFields(async (error, values) => {
      if (error) {
        setErrorStr(error.nodeNum?.errors?.[0]?.message);
        return;
      }
      setErrorStr('');
      setSaving(true);
      // 保存
      const {
        data: { success },
      } = await service
        .updateAppCheckRow({
          ...record,
          ...values,
        })
        .finally(() => {
          setSaving(false);
        });
      if (success) {
        message.success('操作成功');
        setIsEditing(false);
        okCallback();
      }
    });
  };

  return isEditing ? (
    <span style={{ whiteSpace: 'nowrap' }}>
      <Tooltip title={errorStr}>
        <Icon
          type="info-circle"
          theme="filled"
          style={{
            marginRight: 8,
            cursor: 'pointer',
            color: errorStr
              ? 'var(--FunctionNegative-500, #D24D40)'
              : 'transparent',
          }}
        />
      </Tooltip>

      {form.getFieldDecorator('nodeNum', {
        initialValue: record.nodeNum,
        rules: [
          { required: true, message: '请填写该字段' },
          {
            type: 'integer',
            min: 1,
            max: 10000,
            message: '请输入正确的正整数',
          },
        ],
      })(
        <InputNumber
          style={{ width: 120 }}
          placeholder="请输入"
          precision={0}
          min={1}
          max={10000}
        />
      )}
      <span style={{ marginLeft: 8 }}>/{record.agentNodeNum}</span>
      <span>
        <Button
          type="link"
          style={{
            marginLeft: 8,
            color: 'var(--Brandprimary-500, #0FBBD5)',
          }}
          onClick={saveAgentCount}
          disabled={saving}
        >
          <Icon type={saving ? 'loading' : 'check'} spin={saving} />
        </Button>
        <Button
          type="link"
          style={{
            marginLeft: 4,
            color: 'var(--FunctionNegative-500, #D24D40)',
          }}
          onClick={() => {
            setIsEditing(false);
            setErrorStr('');
            setSaving(false);
          }}
        >
          <Icon type="close" />
        </Button>
      </span>
    </span>
  ) : (
    <span
      style={{
        color:
          record.status === 1
            ? 'var(--FunctionNegative-500, #D24D40)'
            : 'inherit',
      }}
    >
      <span style={{ cursor: 'pointer' }} onClick={() => setDetail(record)}>
        {record.nodeNum}/{record.agentNodeNum}
      </span>
      {detail && (
        <NodeDetailModal
          detail={detail}
          cancelCallback={() => setDetail(undefined)}
        />
      )}
      {editable && (
        <a onClick={() => setIsEditing(true)} style={{ marginLeft: 8 }}>
          <Icon type="edit" />
        </a>
      )}
    </span>
  );
};

export default Form.create()(EditAgentCount);
