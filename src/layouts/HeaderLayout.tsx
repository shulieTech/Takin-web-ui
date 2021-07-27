/**
 * @name 基础布局Layout
 * @author MingShined
 */
import React, { useEffect, useRef } from 'react';
import { Basic } from 'src/types';
import { Layout, ConfigProvider } from 'antd';
import HeaderNode from './components/HeaderNode';
import ContentNode from './components/ContentNode';
import FooterNode from './components/FooterNode';
declare var window: any;

interface HeaderLayoutProps extends Basic.BaseProps {}

const HeaderLayout: React.FC<HeaderLayoutProps> = props => {
  const pathname: string | any = props.location.pathname;
  const popupDom = useRef(null);
  useEffect(() => {
    handleDispatch({
      type: 'app/filterBreadCrumbs',
      payload: pathname
    });
  }, [pathname]);
  const handleDispatch = payload => {
    window.g_app._store.dispatch(payload);
  };
  const { children } = props;
  return (
    <Layout className="flex flex-1">
      <HeaderNode />
      <Layout className="flex">
        <ConfigProvider getPopupContainer={() => popupDom.current}>
          <div className="h-100p" ref={popupDom}>
            <ContentNode children={children} />
            <FooterNode />
          </div>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
};

export default HeaderLayout;
