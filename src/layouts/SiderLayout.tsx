/**
 * @name 基础布局Layout
 * @author MingShined
 */
import { ConfigProvider, Layout } from 'antd';
import { connect } from 'dva';
import { useStateReducer } from 'racc';
import React, { useEffect, useRef } from 'react';
import { AppModelState } from 'src/models/app';
import UserService from 'src/services/user';
import { Basic } from 'src/types';
import venomBasicConfig from 'src/venom.config';
import { router, qiankunStart } from 'umi';
import ContentNode from './components/ContentNode';
import SiderMenu from './components/SiderMenu';

declare var window: any;

interface SiderLayoutProps extends Basic.BaseProps, AppModelState {}

const SiderLayout: React.FC<SiderLayoutProps> = props => {
  const [state, setState] = useStateReducer({
    collapsedStatus: false
  });

  const pathname: string | any = props.location.pathname;
  const popupDom = useRef(null);

  const { location } = props;
  useEffect(() => {
    qiankunStart();
  }, []);
  useEffect(() => {
    handleDispatch({
      type: 'app/filterBreadCrumbs',
      payload: pathname
    });
    if (!localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, [pathname]);

  useEffect(() => {
    if (JSON.stringify(props.dictionaryMap) === '{}') {
      handleDispatch({
        type: 'common/getDictionaries'
      });
    }
    if (!localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('trowebBtnResource')) {
      queryBtnResource();
    }
  }, []);

  useEffect(() => {
    if (pathname === '/') {
      queryUserResource();
      if (!localStorage.getItem('trowebBtnResource')) {
        queryBtnResource();
      }
    }
  }, []);

  /**
   * @name 获取菜单权限
   */
  const queryUserResource = async () => {
    const {
      headers,
      data: { data, success }
    } = await UserService.queryUserResource({});
    if (success) {
      localStorage.setItem('trowebUserResource', JSON.stringify(data));
      if (!localStorage.getItem('troweb-role')) {
        localStorage.setItem('troweb-role', headers['x-user-type']);
      }
      if (!localStorage.getItem('troweb-expire')) {
        localStorage.setItem('troweb-expire', headers['x-expire']);
      }

      const urlString = Object.keys(data) && Object.keys(data)[0];
      const urls = urlString && urlString.replace(/_/, '/');
      const url = urls ? `/${urls}` : '/';
      router.push(url);
    }
  };

  /**
   * @name 获取按钮权限
   */
  const queryBtnResource = async () => {
    const {
      data: { data, success }
    } = await UserService.queryBtnResource({});
    if (success) {
      localStorage.setItem('trowebBtnResource', JSON.stringify(data));
    }
  };

  const handleDispatch = payload => {
    window.g_app._store.dispatch(payload);
  };
  const { children } = props;

  const handlerCollapsed = () => {
    setState({
      collapsedStatus: !state.collapsedStatus
    });
  };

  return (
    <Layout
      className={venomBasicConfig.fixSider ? 'flex flex-1 h-100p' : 'mh-100p'}
    >
      <SiderMenu
        collapsedStatus={state.collapsedStatus}
        onCollapse={handlerCollapsed}
        location={location}
      />
      <Layout className="flex" style={{ backgroundColor: '#1D2530' }}>
        {/* <HeaderNode
          onCollapse={handlerCollapsed}
          collapsedStatus={state.collapsedStatus}
        /> */}
        <ConfigProvider getPopupContainer={() => popupDom.current}>
          <div
            className="h-100p"
            style={{ backgroundColor: '#1D2530' }}
            ref={popupDom}
          >
            <ContentNode children={children} />
            {/* <FooterNode /> */}
          </div>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
};

export default connect(({ app, common }) => ({ ...app, ...common }))(
  SiderLayout
);
