import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row, Statistic, Col, Button } from 'antd';
import Link from 'umi/link';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const QuickEntry: React.FC<Props> = props => {
  const { data } = props;
  const menuAuthority: any =
    localStorage.getItem('trowebUserResource') &&
    JSON.parse(localStorage.getItem('trowebUserResource'));
  if (data) {
    return (
      <div className={styles.border}>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <span className={styles.blueline} />
            <span className={`${styles.boldTitle}`}>快捷入口</span>
          </Col>
        </Row>
        <Row type="flex" className={styles.entryWrap}>
          <Col
            span={12}
            className={styles.iconWrap}
            style={{
              display:
                menuAuthority?.pressureTestManage_pressureTestScene &&
                  menuAuthority?.flowAccount ? 'block' : 'none'
            }}
          >
            <Link to="/pressureTestManage/pressureTestScene">
              <Icon style={{ fontSize: 32 }} type={iconType[2]} />
              <p className={styles.iconText}>压测场景</p>
            </Link>
          </Col>
          <Col
            span={12}
            className={styles.iconWrap}
            style={{
              display:
                menuAuthority?.pressureTestManage_pressureTestReport ? 'block' : 'none'
            }}
          >
            <Link to="/pressureTestManage/pressureTestReport">
              <Icon style={{ fontSize: 32 }} type={iconType[3]} />
              <p className={styles.iconText}>压测报告</p>
            </Link>
          </Col>
          <Col
            span={12}
            className={styles.iconWrap}
            style={{
              display:
                menuAuthority?.pressureTestManage_pressureTestScene ? 'block' : 'none'
            }}
          >
            <Link to="/pressureTestManage/pressureTestScene/pressureTestSceneConfig?action=add">
              <Icon style={{ fontSize: 32 }} type={iconType[1]} />
              <p className={styles.iconText}>发起压测</p>
            </Link>
          </Col>
          <Col
            span={12}
            className={styles.iconWrap}
            style={{
              display:
                menuAuthority?.appManage ? 'block' : 'none'
            }}
          >
            <Link to="/appManage">
              <Icon style={{ fontSize: 32 }} type={iconType[4]} />
              <p className={styles.iconText}>应用列表</p>
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
  return <Loading />;
};
export default QuickEntry;

export const iconType = {
  1: 'file-add',
  2: 'bank',
  3: 'file-text',
  4: 'copy'
};
