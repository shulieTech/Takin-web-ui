import React, { useState, useLayoutEffect } from 'react';
import { Button, Col, Row } from 'antd';
import router from 'umi/router';
import { withRouter } from 'umi';
// fix: #APFF-615
import 'antd/lib/tree-select/style/index.less';
import 'antd/lib/transfer/style/index.less';

const NotFound = () => {
  return (
    <div style={{ paddingTop: '150px' }}>
      <Row>
        <Col offset={4} span={8}>
          <div
            style={{
              width: '430px',
              height: '360px',
              // background:
              //   'url("https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg")'
            }}
          />
        </Col>
        <Col span={8}>
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 600,
              color: 'rgb(67, 78, 89)',
            }}
          >
            404
          </h1>
          <p style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.45)' }}>
            抱歉，你访问的页面不存在
          </p>
          <Button type="primary" onClick={() => { window.parent.location.hash = '#/dashboard'; }}>
            返回首页
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const NotFoundAndChildPage = withRouter((props) => {
  const {
    location: { pathname },
  } = props;
  const [frameSrc, setFrameSrc] = useState('');

  const getFrameSrc = () => {
    if (pathname.startsWith('/pro')) {
      setFrameSrc(`/tro-pro/${window.location.hash}`);
    }
  };

  useLayoutEffect(() => {
    getFrameSrc();
  }, [pathname]);

  return frameSrc ? (
    <iframe
      src={frameSrc}
      style={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: '4px 4px 0 0',
        overflow: 'scroll',
        border: 'none',
      }}
    />
  ) : (
    <NotFound />
  );
});

export default NotFoundAndChildPage;
