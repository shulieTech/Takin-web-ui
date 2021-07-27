import { Col, Row } from 'antd';
import React, { Fragment } from 'react';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx/CustomDetailHeader';
import { DetailState } from '../detailPage';
import styles from './../index.less';

interface Props {
  state?: DetailState;
}
const LinkDebugDetailHeader: React.FC<Props> = props => {
  const { state } = props;
  const { debugResultDetail } = state;
  const data = [
    {
      name: '调试ID',
      value: debugResultDetail.id,
      color: '#11BBD5'
    },
    {
      name: '响应状态码',
      value: debugResultDetail.responseCode,
      color: '#11BBD5'
    },
    {
      name: '调用总时长',
      value: debugResultDetail.callTime,
      color: '#11BBD5',
      extra: 'ms'
    },
    {
      name: '请求时间',
      value: debugResultDetail.requestTime,
      color: '#595959'
    }
  ];

  return (
    <CustomDetailHeader
      img={
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '100%',
            // background: 'linear-gradient(228deg, #ACD1FD 0%, #64E1DF 100%)',
            background: `${
              state.debugStatus === '成功'
                ? 'linear-gradient(228deg, #ACD1FD 0%, #64E1DF 100%)'
                : state.debugStatus === '失败'
                ? 'linear-gradient(224deg, #FFB5A1 0%, #FF5B47 100%)'
                : 'linear-gradient(223deg, #BBC4D4 0%, #838B99 100%)'
            }`,
            textAlign: 'center'
          }}
        >
          <img
            style={{ width: 31, marginTop: 15 }}
            src={require(`./../../../../assets/${
              state.debugStatus === '调试中'
                ? 'debuging_icon'
                : 'result_detail_icon'
            }.png`)}
          />
        </div>
      }
      dataSource={data}
      title={debugResultDetail && debugResultDetail.businessLinkName}
    />
  );
};
export default LinkDebugDetailHeader;
