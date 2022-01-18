/**
 * @name 主入口
 */
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React, { useEffect } from 'react';
import DocumentTitle from 'react-document-title';
import HeaderLayout from 'src/layouts/HeaderLayout';
import LoginPage from 'src/pages/user/loginPage';
import { Basic } from 'src/types';
import { getTakinAuthority } from 'src/utils/utils';
import venomBasicConfig from 'src/venom.config';
import { router } from 'umi';
import withRouter from 'umi/withRouter';
import SiderLayout from './SiderLayout';
import useTheme from 'src/utils/useTheme';
import services from 'src/services/app';

moment.locale('zh-cn');

const IndexLayout: React.FC<Basic.BaseProps> = (props) => {
  const { children, location } = props;
  let layout = null;

  const { setTheme, resetTheme, loadThemeConfig } = useTheme();

  // 权限判断
  if (getTakinAuthority() !== 'false' && location.pathname === '/login') {
    layout = <LoginPage />;
  } else {
    // 跳转到首页
    if (location.pathname === '/login') {
      router.push('/');
    }
    layout =
      venomBasicConfig.layout === 'header' ? (
        <HeaderLayout location={location} children={children} />
      ) : (
        <SiderLayout location={location} children={children} />
      );
  }

  const getThemeFromRemote = async () => {
    const {
      data: { data, success },
    } = await services.getTheme();
    if (success && Object.keys(data)?.length > 0) {
      setTheme(data);
    }
  };
  
  useEffect(() => {
    loadThemeConfig();
    setTimeout(() => {
      if (getTakinAuthority() === 'true') {
        getThemeFromRemote();
      }
    });
  }, []);

  return (
    <DocumentTitle title={venomBasicConfig.title}>
      <ConfigProvider 
        locale={zh_CN} 
        getPopupContainer={trigger => window.parent.document.body}
      >
        {layout}
      </ConfigProvider>
    </DocumentTitle>
  );
};

export default withRouter(IndexLayout);
