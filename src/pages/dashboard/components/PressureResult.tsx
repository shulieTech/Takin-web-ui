import React, { Fragment } from 'react';
import styles from './../index.less';
import { Tooltip, Icon, Row, Col, Table } from 'antd';
import Link from 'umi/link';
import Loading from 'src/common/loading';
interface Props {
  data?: any;
}
const PressureResult: React.FC<Props> = props => {
  const { data } = props;
  const menuAuthority: any =
  localStorage.getItem('trowebUserResource') &&
  JSON.parse(localStorage.getItem('trowebUserResource'));

  const columns = [
    {
      title: '压测任务',
      dataIndex: 'sceneName',
      key: 'sceneName'
    },
    {
      title: '压测结果',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (text, row) => {
        return (
          <Fragment>
            <span
              style={{
                display: 'inline-block',
                width: 69,
                height: 24,
                backgroundColor:
                  text === 1
                    ? 'var(--BrandPrimary-500)'
                    : 'var(--FunctionalError-500)',
                color: '#fff',
                textAlign: 'center',
                lineHeight: '24px',
                borderRadius: 13
              }}
            >
              {text === 1 ? '通过' : '不通过'}
            </span>
            {text !== 1 && (
              <span
                style={{ color: 'var(--FunctionalError-500)', marginLeft: 8 }}
              >
                {row.errorMsg}
              </span>
            )}
          </Fragment>
        );
      }
    },
    {
      title: '压测开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: text => {
        return <div style={{ color: '#A2A6B1' }}>开始时间：{text}</div>;
      }
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Link
            to={`/pressureTestManage/pressureTestReport/details?id=${row.id}`}
            style={{
              display:
                menuAuthority?.pressureTestManage_pressureTestReport ? 'block' : 'none'
            }}
          >
            查看报告
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
            <span className={`${styles.boldTitle}`}>近期压测结果</span>
          </Col>
          <Col>
            <Link
              to="/pressureTestManage/pressureTestReport"
              className={styles.more}
              style={{
                display:
                  menuAuthority?.pressureTestManage_pressureTestReport ? 'block' : 'none'
              }}
            >
              更多 <Icon type="right" />
            </Link>
          </Col>
        </Row>
        <Table
          key="id"
          style={{ marginTop: 24 }}
          dataSource={data}
          columns={columns}
          showHeader={false}
          size="small"
          pagination={false}
        />
      </div>
    );
  }
  return <Loading />;
};
export default PressureResult;
