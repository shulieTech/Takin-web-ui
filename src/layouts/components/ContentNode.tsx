/**
 * @name 主体main
 */
import React, { useLayoutEffect, useState } from 'react';
import { Layout, Result } from 'antd';
import venomBasicConfig from 'src/venom.config';
import styles from '../index.less';
import { checkMenuByPath } from 'src/utils/utils';
import { withRouter } from 'umi';

const { Content } = Layout;

const ContentNode: React.FC = props => {
  const hasPageAuth = checkMenuByPath(`${props?.location?.pathname}`);
  // const [footerHeight, setFooterHeight] = useState(0);
  // useLayoutEffect(() => {
  //   const footerEl = document.getElementById('footer');
  //   setFooterHeight(footerEl.offsetHeight);
  // }, []);
  return (
    <div
      style={{
        // paddingTop: venomBasicConfig.fixHeader
        //   ? venomBasicConfig.headerHeight
        //   : 0,
        background: venomBasicConfig.contentBg,
        // minHeight: `calc(100% - ${footerHeight}px)`
        // minHeight: `100%`,
        // height: '100%'
        flex: 1,
      }}
      className="flex flex-1 of-x-hd of-y-at"
    >
      <Content
        className={
          venomBasicConfig.layout === 'header' &&
            venomBasicConfig.contentWidthMode === 'fixed'
            ? styles.wrap
            : 'flex'
        }
        style={{
          flexDirection: 'column',
          // padding: '16px',
          backgroundColor: '#fff',
          marginLeft: '8px',
          marginRight: '8px',
          marginTop: '8px',
          borderRadius: '4px 4px 0 0',
          overflow: 'scroll'
        }}
      >
        {hasPageAuth ? props.children : <Result status="403" title="提示" subTitle="抱歉，你没有权限访问该页面" />}
      </Content>
    </div>
  );
};

export default withRouter(ContentNode);
