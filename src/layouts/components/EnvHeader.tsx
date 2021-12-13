import React, { useState, useEffect } from 'react';
import {
  Dropdown,
  Menu,
  Icon,
  Button,
  Row,
  Col,
  Divider,
  Avatar,
  Popover,
  Card,
  message,
  Input
} from 'antd';
import { getTakinAuthority, getTakinTenantAuthority } from 'src/utils/utils';
import tenantCode from './service';
import _ from 'lodash';
import styles from './../index.less';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import Meta from 'antd/lib/card/Meta';
import { CommonForm, CommonModal } from 'racc';
import UserService from 'src/services/user';
import { FormDataType } from 'racc/dist/common-form/type';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { router } from 'umi';
interface Props {
  onSuccess?: () => void;
}
let path = '';
const EnvHeader: React.FC<Props> = props => {
  const userType: string = localStorage.getItem('troweb-role');
  const [envList, setEnvList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [tenantList, setTenantList] = useState([]);
  const [desc, setDesc] = useState('');

  const dismissPopover = e => {
    e.stopPropagation();
    if (visible) {
      setVisible(false);
    }
  };

  useEffect(() => {
    if (getTakinTenantAuthority() === 'true') {
      queryTenantList();
    }
  }, []);

  const queryTenantList = async () => {
    const {
      data: { success, data }
    } = await tenantCode.tenant({
      tenantCode: localStorage.getItem('tenant-code')
    });
    if (success) {
      setTenantList(data);
      const indexs = _.findIndex(data, [
        'tenantName',
        localStorage.getItem('tenant-code')
      ]);
      setEnvList(data[indexs]?.envs);
      const arr = data[indexs]?.envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      if (localStorage.getItem('env-code') === null) {
        localStorage.setItem('env-code', arr[indexs]?.envCode);
        setDesc(arr[indexs]?.desc);
      } else {
        const ind = _.findIndex(data[indexs].envs, [
          'envCode',
          localStorage.getItem('env-code')
        ]);
        setDesc(data[indexs].envs[ind]?.desc);
      }
    }
  };

  function getPath(lists) {
    if (lists.length === 0) {
      return;
    }
    if (lists[0].type === 'Item') {
      path = lists[0].path;
    }
    [lists[0]].forEach(list => {
      if (list.children) {
        getPath(list.children);
      }
    });
    return path;
  }

  const changeTenant = async code => {
    const {
      data: { success, data }
    } = await tenantCode.tenantSwitch({
      targetTenantCode: code
    });
    if (success) {
      localStorage.setItem('tenant-code', code);
      setEnvList(data.envs);
      const arr = data.envs.filter(item => {
        if (item.isDefault) {
          return item;
        }
      });
      localStorage.setItem('env-code', arr[0]?.envCode);
      setDesc(arr[0]?.desc);
      localStorage.removeItem('trowebUserResource');
      localStorage.removeItem('trowebBtnResource');
      localStorage.removeItem('trowebUserMenu');
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
        window.location.reload();
      }
    }
  };

  const changeCode = async (code, descs) => {
    const {
      data: { success, data }
    } = await tenantCode.envSwitch({
      targetEnvCode: code
    });
    if (success) {
      setDesc(descs);
      localStorage.setItem('env-code', code);
      localStorage.removeItem('trowebUserResource');
      localStorage.removeItem('trowebBtnResource');
      localStorage.removeItem('trowebUserMenu');
      if (window.location.hash === '#/dashboard') {
        window.location.reload();
      } else {
        window.location.hash = '#/dashboard';
        window.location.reload();
      }
    }
  };
  const index = _.findIndex(envList, [
    'envCode',
    localStorage.getItem('env-code')
  ]);
  const indexcode = _.findIndex(tenantList, [
    'tenantCode',
    localStorage.getItem('tenant-code')
  ]);

  const handleLogout = async () => {
    const {
      data: { success, data }
    } = await UserService.troLogout({});
    if (success) {
      message.success('登录已失效，请重新登录');
      const storageList = [
        'troweb-role',
        'isAdmin',
        'troweb-userName',
        'full-link-token',
        'trowebUserResource',
        'trowebBtnResource',
        'auth-cookie',
        'troweb-expire',
        'troweb-userId',
        'trowebUserMenu',
        'takinAuthority',
        'Access-Token'
      ];
      storageList.forEach(item => localStorage.removeItem(item));
      if (data && data.indexUrl) {
        location.href = `${data.indexUrl}`;
        return;
      }
      router.push('/login');
    }
  };

  const title = (
    <span
      onClick={e => {
        e.stopPropagation();
        setVisible(true);
      }}
    >
      <span> {localStorage.getItem('troweb-userName')}</span>
      <span style={{ paddingLeft: '20px' }}>
        <Icon type="setting" />
      </span>
    </span>
  );

  const content = (
    <div onClick={dismissPopover}>
      <div>
        <EditPasswordModal onSuccess={handleLogout} />
      </div>
      <div>
        <a
          href="https://docs.shulie.io/docs/forcecop/Takin-about"
          rel="noreferrer"
          target="_blank"
        >
          <Button type="link">帮助文档</Button>
        </a>
      </div>
      <Button type="link" onClick={handleLogout}>
        登出
      </Button>
    </div>
  );
  return (
    <Row
      type="flex"
      justify="space-between"
      className={styles.logo}
      style={{
        display: getTakinTenantAuthority() === 'false' ? 'none' : 'flex'
      }}
    >
      <Col>
        <div className={styles.titleName}>
          <CustomIcon
            iconWidth={36}
            imgWidth={26}
            imgName="takin_logo"
            color="var(--BrandPrimary-500)"
          />
          <span className={styles.logoName}>Takin</span>
          <Divider
            type="vertical"
            style={{ height: '20px', margin: '0 32px' }}
          />
          <span
            style={{
              color: 'var(--FunctionalAlert-900)',
              fontSize: '20px'
            }}
          >
            {desc}
          </span>
          <Button.Group>
            <Dropdown
              overlay={
                <Menu>
                  {tenantList.map(x => (
                    <Menu.Item
                      key={x.tenantId}
                      onClick={() => changeTenant(x.tenantCode)}
                    >
                      {x.tenantNick}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button
                type="primary"
                style={{
                  display: userType === '0' ? 'inline-block' : 'none'
                }}
              >
                租户：
                {tenantList[indexcode]?.tenantNick}
                <Icon type="down" />
              </Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu>
                  {envList.map((x, ind) => (
                    <Menu.Item
                      key={ind}
                      onClick={() => changeCode(x.envCode, x.desc)}
                    >
                      {x.envName}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button
                type="primary"
                style={{
                  borderTopLeftRadius: userType === '0' ? '0px' : '4px',
                  borderBottomLeftRadius: userType === '0' ? '0px' : '4px'
                }}
              >
                环境：
                {envList[index]?.envName}
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Button.Group>
        </div>
      </Col>
      <Col>
        {getTakinAuthority() === 'true' && (
          <Card className={styles.menuCard}>
            <Popover
              content={content}
              placement="topLeft"
              visible={visible}
              trigger="click"
              arrowPointAtCenter
              onVisibleChange={v => setVisible(v)}
            >
              <Meta
                avatar={<Avatar />}
                title={title}
                className={styles.menuMeta}
              />
            </Popover>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default EnvHeader;

const EditPasswordModal: React.FC<Props> = props => {
  const [form, setForm] = useState<WrappedFormUtils>(null);
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'account',
        label: '当前账号',
        options: {
          initialValue: localStorage.getItem('troweb-userName')
        },
        node: <Input disabled />
      },
      {
        key: 'oldPassword',
        options: {
          initialValue: undefined,
          rules: [{ required: true, message: '请输入旧密码' }]
        },
        label: '请输入旧密码',
        node: <Input />
      },
      {
        key: 'newPassword',
        options: {
          initialValue: undefined,
          rules: [
            {
              required: true,
              message: '请输入新密码,8-20个字符',
              min: 8,
              max: 20
            }
          ]
        },
        label: '请输入新密码',
        node: (
          <Input
            placeholder="请输入新密码，8-20个字符"
            minLength={8}
            maxLength={20}
          />
        )
      }
    ];
  };
  const handleSubmit = () => {
    return new Promise(resolve => {
      form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const {
          data: { success }
        } = await UserService.updatePassword({
          ...values,
          id: localStorage.getItem('troweb-userId')
        });
        if (success) {
          props.onSuccess();
          resolve(true);
          return;
        }
        resolve(false);
      });
    });
  };
  return (
    <CommonModal
      beforeOk={handleSubmit}
      btnText="修改密码"
      btnProps={{ type: 'link' }}
      modalProps={{ title: '修改密码' }}
    >
      <CommonForm
        btnProps={{ isSubmitBtn: false, isResetBtn: false }}
        rowNum={1}
        getForm={f => setForm(f)}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
