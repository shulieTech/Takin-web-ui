/**
 * @name 全局路由页组件
 * @author Xunhuan
 */
import { Affix, Col, Row } from 'antd';
import { connect } from 'dva';
import React, { Component } from 'react';
import styles from './index.less';

interface BasePageLayoutProps {
  extra?: React.ReactNode | any;
  extraPosition?: string | any; // default[ 1=bottom ],  [2= top]
  title?: string | any;
}

@connect(({ app }) => ({ ...app }))
export default class BasePageLayout extends Component<BasePageLayoutProps> {
  render() {
    const { children, extra, title, extraPosition } = this.props;
    return (
      <div className={styles.baseLayConent}>
        <Affix
          offsetTop={64}
          target={() => document.getElementById('contentLayout')}
        >
          <div className="pd-r1x" style={{ borderBottom: '1px solid #eee', paddingBottom: 16 }}>
            <Row type="flex" align="middle" justify="space-between">
              <h1 className="ft-20 mg-b0">{title}</h1>
              {(extraPosition === 'top' || extraPosition === '2') && (
                <Col>{extra}</Col>
              )}
            </Row>
          </div>
        </Affix>

        <div className="of-x-hd ofy-at pd-t3x pd-b3x">{children}</div>
        {(extraPosition === 'bottom' || !extraPosition) && (
          <div className={styles.baseLayFoot}>
            <div className={styles.baseLayFootControl}>
              <Row type="flex" align="middle" justify="center">
                <Col>{extra}</Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    );
  }
}
