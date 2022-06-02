import React, { useState, useEffect, useMemo, useContext } from 'react';
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createAsyncFormActions,
  FormEffectHooks,
} from '@formily/antd';
import { Input, ArrayTable, FormTab } from '@formily/antd-components';
import { Drawer, Button, Modal, Icon, message } from 'antd';
import service from '../service';
import copy from 'copy-to-clipboard';
import styles from '../index.less';
import { getTakinAuthority } from 'src/utils/utils';
import UserModal from './Users';
import { SenceContext } from '../indexPage';

interface Props {
  detail: any;
  okCallback: () => void;
  cancelCallback: () => void;
}

const Params: React.FC<Props> = (props) => {
  const { detail, okCallback, cancelCallback } = props;
  const actions = useMemo(() => createAsyncFormActions(), []);
  const {
    listRefreshKey,
    setListRefreshKey,
    detailRefreshKey,
    setDetailRefreshKey,
  } = useContext(SenceContext);
  const [formChanged, setFormChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { onFieldValueChange$, onFieldInputChange$, onFormMount$ } =
    FormEffectHooks;

  const saveBase = async () => {
    const { values } = await actions.submit();
    setSaving(true);
    const {
      data: { success, data },
    } = await service
      .updateSence({
        ...detail,
        ...values,
      })
      .finally(() => {
        setSaving(false);
      });
    if (success) {
      setFormChanged(false);
      okCallback();
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      Modal.confirm({
        title: '提示',
        content: '您有未保存内容，是否保存修改后退出？',
        okText: '保存并退出',
        onCancel: cancelCallback,
        onOk: saveBase,
      });
    } else {
      cancelCallback();
    }
  };

  const showUserModal = async () => {
    if (getTakinAuthority() !== 'true') {
      return;
    }
    // const { values } = await actions.getFormState();
    // setSelectedUser([{ id: values.userId, accountName: values.userName }]);
    setSelectedUser([{ id: detail.userId, accountName: detail.userName }]);
  };

  const changeOwner = async (user) => {
    const {
      data: { success },
    } = await service.allocation({
      dataId: detail.id,
      menuCode: 'INTERFACE_TEST',
      userId: user.id,
    });
    if (success) {
      message.success('分配成功');
      setDetailRefreshKey(detailRefreshKey + 1);
      setListRefreshKey(listRefreshKey + 1);
    }
    setSelectedUser(null);
  };

  const formEffects = () => {
    onFieldInputChange$().subscribe((fieldState) => {
      setFormChanged(true);
    });
  };

  return (
    <Drawer
      visible
      title="场景基本信息"
      width={'40vw'}
      bodyStyle={{
        position: 'relative',
        padding: 0,
        paddingBottom: 60,
        height: `calc(100% - 60px)`,
        overflow: 'hidden',
      }}
      onClose={handleCancel}
    >
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          padding: 24,
        }}
      >
        <SchemaForm
          actions={actions}
          components={{
            Input,
            TextArea: Input.TextArea,
          }}
          effects={formEffects}
          initialValues={detail}
        >
          <Field
            name="name"
            title="场景名称"
            required
            x-component="Input"
            x-component-props={{
              readOnly: true,
              placeholder: '请输入',
              style: {
                width: 320,
                background: '#F7F8FA',
              },
            }}
            x-rules={[{ required: true, message: '请输入场景名称' }]}
          />
          <Field
            name="id"
            title="场景ID"
            required
            x-component="Input"
            x-component-props={{
              readOnly: true,
              placeholder: '请输入',
              className: styles['group-gray-input'],
              style: {
                width: 320,
              },
              addonAfter: (
                <Icon
                  style={{ color: '#11BBD5' }}
                  type="copy"
                  onClick={() => {
                    copy(detail.id);
                    message.success('复制成功');
                  }}
                />
              ),
            }}
            x-rules={[{ required: true, message: '请输入' }]}
          />
          <Field
            name="userId"
            title="归属人id"
            required
            x-component="Input"
            default={detail.userId}
            x-component-props={{
              readOnly: true,
            }}
            x-rules={[{ required: true, message: '请选择归属人' }]}
            display={false}
          />
          <Field
            name="userName"
            title="归属人"
            // required
            x-component="Input"
            default={detail.userName}
            x-component-props={{
              readOnly: true,
              placeholder: '请选择',
              style: {
                width: 320,
                background: '#F7F8FA',
              },
              onClick: showUserModal,
            }}
            // x-rules={[{ required: true, message: '请选择归属人' }]}
          />
          <Field
            name="remark"
            title="简介"
            x-component="TextArea"
            x-component-props={{
              placeholder: '给业务流程增加一些描述吧～',
              style: {
                width: 670,
              },
              maxLength: 200,
              rows: 4,
            }}
          />
        </SchemaForm>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'right',
          padding: '12px 24px',
          borderTop: '1px solid #e8e8e8',
        }}
      >
        <Button onClick={handleCancel} style={{ marginRight: 8 }}>
          取消
        </Button>
        <Button type="primary" ghost onClick={saveBase} loading={saving}>
          保存
        </Button>
      </div>
      {selectedUser && (
        <UserModal
          zIndex={1001}
          defaultValue={selectedUser}
          cancelCallback={() => setSelectedUser(null)}
          okCallback={(result) => {
            if (result?.length !== 1) {
              message.warn('请选择人员');
              return;
            }
            setSelectedUser(null);
            changeOwner(result[0]);
            // actions.setFieldState('userId', (state) => {
            //   state.value = result[0].id;
            // });
            // actions.setFieldState('userName', (state) => {
            //   state.value = result[0].accountName;
            // });
          }}
        />
      )}
    </Drawer>
  );
};

export default Params;
