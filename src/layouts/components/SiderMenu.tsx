/**
 * @name 菜单栏
 */
import {
  Avatar,
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Menu,
  message,
  Popover,
  Divider,
  Tooltip,
} from 'antd';
import Meta from 'antd/lib/card/Meta';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { connect } from 'dva';
import { CommonForm, CommonModal } from 'racc';
import { FormDataType } from 'racc/dist/common-form/type';
import React, { useEffect, useState } from 'react';
import { AppModelState } from 'src/models/app';
import UserService from 'src/services/user';
import venomBasicConfig from 'src/venom.config';
import router from 'umi/router';
import styles from '../index.less';
import renderMenuNode from './MenuNode';
import TitleNode from './TitleNode';
import { getTakinAuthority, treeFindPath } from 'src/utils/utils';

const { Sider } = Layout;

interface Props extends AppModelState {
  collapsedStatus?: boolean;
  onCollapse?: () => void;
  location?: any;
  // addNavTabItemEvent?: () => void;
}

const SiderMenu: React.FC<Props> = (props) => {
  const [openKeys, setOpenKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const { location, collapsed } = props;
  const keys = [location.pathname];

  const dismissPopover = (e) => {
    e.stopPropagation();
    if (visible) {
      setVisible(false);
    }
  };
  const menuLists = localStorage.getItem('trowebUserMenu');

  useEffect(() => {
    document.body.addEventListener('click', dismissPopover);
    return () => {
      document.body.removeEventListener('click', dismissPopover);
    };
  }, []);

  const handleLogout = async () => {
    const {
      data: { success, data },
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
        'Access-Token',
      ];
      storageList.forEach((item) => localStorage.removeItem(item));
      if (data && data.indexUrl) {
        location.href = `${data.indexUrl}`;
        return;
      }
      router.push('/login');
      window.location.reload();
    }
  };

  const content = (
    <div onClick={dismissPopover} style={{ lineHeight: '32px' }}>
      <div>
        <EditPasswordModal onSuccess={handleLogout} />
      </div>
      <div>
        <a
          href="https://docs.shulie.io/docs/forcecop/Takin-about"
          rel="noreferrer"
          target="_blank"
        >
          <Button type="link" style={{ padding: '0 15px' }}>
            帮助文档
          </Button>
        </a>
      </div>
      <Button type="link" style={{ padding: '0 15px' }} onClick={handleLogout}>
        登出
      </Button>
    </div>
  );

  const title = (
    <span
      style={{ display: 'flex' }}
      onClick={(e) => {
        e.stopPropagation();
        setVisible(true);
      }}
    >
      {!props.collapsedStatus && (
        <Tooltip title={localStorage.getItem('troweb-userName')}>
          <span
            style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {' '}
            {localStorage.getItem('troweb-userName')}
          </span>
        </Tooltip>
      )}
      <span style={{ paddingLeft: '20px' }}>
        <Icon type="setting" />
      </span>
    </span>
  );

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={props.collapsedStatus}
      theme={venomBasicConfig.theme}
      width={venomBasicConfig.siderWidth}
      className={`${styles.sider}`}
      style={{
        // paddingTop: venomBasicConfig.fixHeader && venomBasicConfig.headerHeight,
        // backgroundColor: 'var(--BrandPrimary-500)',
      }}
      // onCollapse={}
    >
      {/* {!venomBasicConfig.fixHeader && <TitleNode />} */}
      <TitleNode
        collapsedStatus={props.collapsedStatus}
        onCollapsed={props.onCollapse}
        location={props.location}
      />
      <Menu
        theme={venomBasicConfig.theme}
        mode="inline"
        className={`flex-1 of-x-hd`}
        // openKeys={
        //   !props.collapsedStatus
        //     ? openKeys.length
        //       ? venomBasicConfig.siderMultiple
        //         ? openKeys
        //         : [[...openKeys].pop()]
        //       : keys
        //     : openKeys
        // }
        selectedKeys={keys}
        defaultSelectedKeys={keys}
        defaultOpenKeys={treeFindPath(
          JSON.parse(menuLists),
          (data) => data.path === keys[0]
        )}
        onOpenChange={(values) => {
          setOpenKeys(values);
        }}
      >
        {renderMenuNode()}
      </Menu>
      {getTakinAuthority() === 'true' && (
        <Popover
          content={content}
          placement="topLeft"
          visible={visible}
          trigger="click"
          arrowPointAtCenter
          onVisibleChange={(v) => setVisible(v)}
          getPopupContainer={() => window.document.body}
        >
          <Card className={styles.menuCard}>
            <Meta
              avatar={<Avatar style={{ backgroundColor: '#f0f2f5' }} />}
              title={title}
              className={styles.menuMeta}
            />
          </Card>
        </Popover>
      )}
    </Sider>
  );
};

export default connect(({ app }) => ({ ...app }))(SiderMenu);

interface Props {
  onSuccess?: () => void;
}
const EditPasswordModal: React.FC<Props> = (props) => {
  const [form, setForm] = useState<WrappedFormUtils>(null);
  const getFormData = (): FormDataType[] => {
    return [
      {
        key: 'account',
        label: '当前账号',
        options: {
          initialValue: localStorage.getItem('troweb-userName'),
        },
        node: <Input disabled />,
      },
      {
        key: 'oldPassword',
        options: {
          initialValue: undefined,
          rules: [{ required: true, message: '请输入旧密码' }],
        },
        label: '请输入旧密码',
        node: <Input />,
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
              max: 20,
            },
          ],
        },
        label: '请输入新密码',
        node: (
          <Input
            placeholder="请输入新密码，8-20个字符"
            minLength={8}
            maxLength={20}
          />
        ),
      },
    ];
  };
  const handleSubmit = () => {
    return new Promise((resolve) => {
      form.validateFields(async (err, values) => {
        if (err) {
          message.info('请检查表单必填项');
          resolve(false);
          return;
        }
        const {
          data: { success },
        } = await UserService.updatePassword({
          ...values,
          id: localStorage.getItem('troweb-userId'),
        });
        if (success) {
          // message.success('成功修改密码');
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
      btnProps={{ type: 'link', style: { padding: '0 15px' } }}
      modalProps={{ title: '修改密码' }}
    >
      <CommonForm
        btnProps={{ isSubmitBtn: false, isResetBtn: false }}
        rowNum={1}
        getForm={(f) => setForm(f)}
        formItemProps={{ labelCol: { span: 6 }, wrapperCol: { span: 16 } }}
        formData={getFormData()}
      />
    </CommonModal>
  );
};
