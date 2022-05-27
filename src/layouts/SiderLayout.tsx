/**
 * @name 基础布局Layout
 * @author MingShined
 */
import { ConfigProvider, Layout, Modal, notification } from 'antd';
import { connect } from 'dva';
import { useStateReducer } from 'racc';
import React, { useEffect, useRef } from 'react';
import { AppModelState } from 'src/models/app';
import UserService from 'src/services/user';
import { Basic } from 'src/types';
import venomBasicConfig from 'src/venom.config';
import { router } from 'umi';
import ContentNode from './components/ContentNode';
// import FooterNode from './components/FooterNode';
import SiderMenu from './components/SiderMenu';
import queryString from 'query-string';
import EnvHeader from './components/EnvHeader';
// import axios from 'axios';
import { getThemeByKeyName } from 'src/utils/useTheme';

declare var window: any;
let path = '';
interface SiderLayoutProps extends Basic.BaseProps, AppModelState { }

const SiderLayout: React.FC<SiderLayoutProps> = (props) => {
  const [state, setState] = useStateReducer({
    collapsedStatus: false,
    request: false
  });

  const pathname: string | any = props.location.pathname;
  const popupDom = useRef(null);
  useEffect(() => {
    if (queryString.parse(location.search).flag) {
      thirdPartylogin();
    } else {
      setState({ request: true });
    }
  }, []);

  const thirdPartylogin = async () => {
    const {
      data: { success, data }
    } = await UserService.thirdPartylogin({
      // flag: queryString.parse(location.search).flag
      ...queryString.parse(location.search),
    });
    if (success) {
      if (!data.errorMessage) {
        if (data.thirdPartyIsCallback === 0) {
          notification.success({
            message: '通知',
            description: '登录成功',
            duration: 1.5
          });
          localStorage.setItem('troweb-userName', data.name);
          localStorage.setItem('troweb-userId', data.id);
          localStorage.setItem('troweb-role', data.userType);
          localStorage.setItem('isAdmin', data.isAdmin);
          localStorage.setItem('isSuper', data.isSuper);
          localStorage.setItem('tenant-code', data.tenantCode);
          localStorage.setItem('env-code', data.envCode);
          localStorage.setItem('full-link-token', data.xToken);
          localStorage.setItem('troweb-expire', data.expire);
          localStorage.removeItem('Access-Token');
          setState({ request: true });
        }
      } else {
        Modal.error({
          title: '登录失败',
          content: data.errorMessage,
          onOk() {
            loginout();
          },
        });
        setState({ request: false });
      }
    }
  };

  const loginout = async () => {
    // const { data: json } = await axios.get('./version.json');
    // if (json.loginUrl) {
    //   window.location.href = json.loginUrl;
    // } else {
    //   window.g_app._store.dispatch({
    //     type: 'user/troLogout'
    //   });
    // }
    window.g_app._store.dispatch({
      type: 'user/troLogout'
    });
  };

  const { location } = props;
  useEffect(() => {
    handleDispatch({
      type: 'app/filterBreadCrumbs',
      payload: pathname,
    });
    if (state.request && !localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
    if (state.request && !localStorage.getItem('trowebUserResource')) {
      queryUserResource();
    }
  }, [pathname, state.request]);

  useEffect(() => {
    if (state.request && JSON.stringify(props.dictionaryMap) === '{}') {
      handleDispatch({
        type: 'common/getDictionaries',
      });
    }
    if (state.request && !localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, [state.request]);

  useEffect(() => {
    if (state.request && !localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, [state.request]);

  useEffect(() => {
    if (state.request && pathname === '/') {
      queryUserResource();
      if (!localStorage.getItem('trowebBtnResource')) {
        queryBtnResource();
      }
    }
  }, [state.request]);

  useEffect(() => {
    if (state.request) {
      queryMenuList();
    }
  }, [state.request]);

  const queryMenuList = async () => {
    if (JSON.parse(localStorage.getItem('trowebUserMenu')) === null) {
      const {
        data: { data, success },
      } = await UserService.queryMenuList({});
      if (success) {
        localStorage.setItem('trowebUserMenu', JSON.stringify(data));
        router.push(getPath(data));
      }
    }
  };

  /**
   * @name 获取菜单权限
   */
  const queryUserResource = async () => {
    const {
      headers,
      data: { data, success },
    } = await UserService.queryUserResource({});
    if (success) {
      localStorage.setItem('trowebUserResource', JSON.stringify(data));
      if (!localStorage.getItem('troweb-role')) {
        localStorage.setItem('troweb-role', headers['x-user-type']);
      }
      if (!localStorage.getItem('troweb-expire')) {
        localStorage.setItem('troweb-expire', headers['x-expire']);
      }
      const menus = JSON.parse(localStorage.getItem('trowebUserMenu'));
      router.push(menus && getPath(menus));
    }
  };

  function getPath(lists) {
    if (lists.length === 0) {
      return;
    }
    if (lists[0].type === 'Item') {
      path = lists[0].path;
    }
    [lists[0]].forEach((list) => {
      if (list.children) {
        getPath(list.children);
      }
    });
    return path;
  }

  /**
   * @name 获取按钮权限
   */
  const queryBtnResource = async () => {
    const {
      data: { data, success },
    } = await UserService.queryBtnResource({});
    if (success) {
      localStorage.setItem('trowebBtnResource', JSON.stringify(data));
    }
  };

  const handleDispatch = (payload) => {
    window.g_app._store.dispatch(payload);
  };
  const { children } = props;

  const handlerCollapsed = () => {
    setState({
      collapsedStatus: !state.collapsedStatus,
    });
  };

  const disableTenant = getThemeByKeyName('disableTenant');
  
  return (
    <Layout
      className={venomBasicConfig.fixSider ? 'flex flex-1 h-100p' : 'mh-100p'}
    >
      <SiderMenu
        collapsedStatus={state.collapsedStatus}
        onCollapse={handlerCollapsed}
        location={location}
      />
      <Layout
        className="flex"
        style={{
          backgroundColor: '#1D2530',
        }}
      >
        {/* <HeaderNode
           onCollapse={handlerCollapsed}
           collapsedStatus={state.collapsedStatus}
         /> */}
        {
          state.request && <ConfigProvider getPopupContainer={() => popupDom.current}>
          <div
            className="h-100p"
            style={{
              backgroundColor: '#1D2530',
              display: 'flex',
              flexDirection: 'column',
            }}
            ref={popupDom}
          >
            {/* 人寿没有租户 */}
            {!disableTenant && <EnvHeader />}
            <ContentNode children={children} />
            {/* <FooterNode /> */}
          </div>
        </ConfigProvider>}
      </Layout>
    </Layout>
  );
};

export default connect(({ app, common }) => ({ ...app, ...common }))(
  SiderLayout
);
