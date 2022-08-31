import React, { useState, useEffect, useContext } from 'react';
import { Icon, Button, Tooltip, InputNumber, Form } from 'antd';
import { PrepareContext } from '../indexPage';
import service from '../service';

export default Form.create()((prop) => {
  const { record, form } = prop;
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorStr, setErrorStr] = useState('');

  const saveAgentCount = () => {
    form.validateFields((error, values) => {
      if (error) {
        setErrorStr(error.count.errors[0].message);
        return;
      }
      setErrorStr('');
      setSaving(true);
      // TODO 保存
      // console.log(values);
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

      {form.getFieldDecorator('count', {
        initialValue: 1,
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
      <span style={{ marginLeft: 8 }}>/1</span>
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
    <span>
      1/1
      <a onClick={() => setIsEditing(true)} style={{ marginLeft: 8 }}>
        <Icon type="edit" />
      </a>
    </span>
  );
});
