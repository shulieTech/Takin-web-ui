/**
 * @name 主入口
 */
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React from 'react';
import DocumentTitle from 'react-document-title';
import HeaderLayout from 'src/layouts/HeaderLayout';
import LoginPage from 'src/pages/user/loginPage';
import { Basic } from 'src/types';
import venomBasicConfig from 'src/venom.config';
import withRouter from 'umi/withRouter';
import SiderLayout from './SiderLayout';
moment.locale('zh-cn');

const IndexLayout: React.FC<Basic.BaseProps> = props => {
  const { children, location } = props;
  let layout = null;

  // if (!localStorage.getItem('troweb-userName')) {
  //   layout = <LoginPage />;
  // } else
  if (location.pathname === '/login') {
    layout = <LoginPage />;
  } else {
    layout =
      venomBasicConfig.layout === 'header' ? (
        <HeaderLayout location={location} children={children} />
      ) : (
        <SiderLayout location={location} children={children} />
      );
  }
  // layout =
  //   venomBasicConfig.layout === 'header' ? (
  //     <HeaderLayout location={location} children={children} />
  //   ) : (
  //     <SiderLayout location={location} children={children} />
  //   );
  return (
    <DocumentTitle title={venomBasicConfig.title}>
      <ConfigProvider locale={zh_CN}>{layout}</ConfigProvider>
    </DocumentTitle>
  );
};

export default withRouter(IndexLayout);
