import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row, Col, Table } from 'antd';
import Link from 'umi/link';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const PressureScene: React.FC<Props> = props => {
  const { data } = props;
  const menuAuthority: any =
    localStorage.getItem('trowebUserResource') &&
    JSON.parse(localStorage.getItem('trowebUserResource'));

  const columns = [
    {
      title: '压测场景时间',
      dataIndex: 'sceneName',
      key: 'sceneName',
      render: text => {
        return <div style={{ fontSize: '18px' }}>{text}</div>;
      }
    },
    {
      title: '最大并发',
      dataIndex: 'threadNum',
      key: 'threadNum',
      render: text => {
        return <div style={{ color: '#A2A6B1' }}>最大并发：{text}</div>;
      }
    },
    {
      title: '开始时间',
      dataIndex: 'lastPtTime',
      key: 'lastPtTime',
      render: text => {
        return <div style={{ color: '#A2A6B1' }}>开始时间：{text}</div>;
      }
    },
    {
      title: '查看实况',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Link
            to={`/pressureTestManage/pressureTestReport/pressureTestLive?id=${row.id}`}
          >
            查看实况
          </Link>
        );
      }
    }
  ];
  if (data) {
    return (
      <div className={styles.border} style={{ marginLeft: 32 }}>
        <Row type="flex" align="middle" justify="space-between">
          <Col>
            <span className={styles.blueline} />
            <span className={`${styles.boldTitle}`}>正在压测场景</span>
          </Col>
          <Col>
            <Link
              to="/pressureTestManage/pressureTestScene"
              className={styles.more}
              style={{
                display:
                  menuAuthority?.pressureTestManage_pressureTestScene &&
                    menuAuthority?.flowAccount ? 'block' : 'none'
              }}
            >
              更多 <Icon type="right" />
            </Link>
          </Col>
        </Row>
        {data && data.length > 0 ? (
          <Table
            key="id"
            style={{ marginTop: 24 }}
            dataSource={data}
            columns={columns}
            showHeader={false}
            size="small"
            pagination={false}
          />
        ) : (
          <div className={styles.defaultWrap}>
            <div className={styles.circle} />
            <p className={styles.defaultTxt}>没有正在进行的压测</p>
          </div>
        )}
      </div>
    );
  }
  return <Loading />;
};
export default PressureScene;
