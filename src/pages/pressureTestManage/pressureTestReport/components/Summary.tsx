import { Col, Row, Statistic } from 'antd';
import React from 'react';
import WarningDetailModal from '../modals/WarningDetailModal';
import styles from './../index.less';
import BusinessActivityFailList from './BusinessActivityFailList';
interface Props {
  list?: any;
  style?: React.CSSProperties;
  leftWrap?: React.ReactNode;
  detailData?: any;
  id?: string;
}

const Summary: React.FC<Props> = props => {
  const { detailData, id } = props;
  const data =
    detailData &&
    detailData.businessActivity &&
    detailData.businessActivity.filter((item, k) => {
      if (item.passFlag === 0) {
        return { ...item };
      }
    });
  return (
    <Row
      type="flex"
      align="middle"
      justify="space-around"
      style={{
        width: '100%',
        padding: '8px 16px',
        background: '#75D0DD',
        borderRadius: 8,
        ...props.style
      }}
    >
      {props.leftWrap}
      <Col span={20}>
        <Row
          type="flex"
          justify="space-between"
          style={{
            background: '#F9FEFF',
            padding: '15px 40px',
            borderRadius: 8
          }}
        >
          {props.list.map((item, k) => {
            return (
              <Col key={k}>
                <p className={styles.rightTitle}>{item.label}</p>
                <p className={styles.rightValue}>
                  {item.value === null ? (
                    '-'
                  ) : item.label === '警告' ? (
                    <WarningDetailModal
                      reportId={detailData.id}
                      btnText={
                        <Statistic
                          value={item.value}
                          precision={item.precision}
                          valueStyle={{ color: item.color ? item.color : '' }}
                          suffix={item.suffix ? item.suffix : ''}
                        />
                      }
                    />
                  ) : item.render ? item.render() : (
                    <Statistic
                      value={item.value}
                      precision={item.precision}
                      valueStyle={{ color: item.color ? item.color : '' }}
                      suffix={item.suffix ? item.suffix : ''}
                    />
                  )}
                </p>
                {item?.hasFail && <div style={{ color: 'red' }}>(存在小部分失败<br/>请求，请查看明细)</div>}
              </Col>
            );
          })}
        </Row>
      </Col>
      {data && data.length > 0 && (
        <BusinessActivityFailList id={id} data={data} />
      )}
    </Row>
  );
};
export default Summary;
