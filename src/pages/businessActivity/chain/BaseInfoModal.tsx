/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import React, { Fragment, useContext } from 'react';
import { CommonModelState } from 'src/models/common';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { ActivityBean } from '../enum';
import { Modal } from 'antd';

interface Props extends CommonModelState {}
const SiderBasicInfo: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const dataSource = [
    {
      label: '业务活动名称',
      key: ActivityBean.业务活动名称,
    },
    {
      label: '所属应用',
      key: ActivityBean.所属应用,
    },
    {
      label: '服务类型',
      key: ActivityBean.服务类型,
    },
    {
      label: '服务/入口',
      key: ActivityBean['服务/入口'],
    },
    // {
    //   label: '业务活动类型',
    //   key: ActivityBean.业务活动类型,
    //   render: text => props.dictionaryMap.isCore.find(item => +item.value === +text).label
    // },
    {
      label: '业务活动级别',
      key: ActivityBean.业务活动级别,
    },
    // {
    //   label: '业务域',
    //   key: ActivityBean.业务域,
    //   render: text => props.dictionaryMap.domain.find(item => +item.value === +text).label
    // }
  ];
  return (
    <Modal
      visible={state.baseInfoVisible}
      width={720}
      onCancel={() => setState({ baseInfoVisible: false })}
      footer={null}
      title={
        <div>
          <span
            className="iconfont icon-xiaoxiduilie"
            style={{
              backgroundColor: 'var(--FunctionalNetural-600, #232C3C)',
              color: '#fff',
              display: 'inline-block',
              verticalAlign: 'middle',
              textAlign: 'center',
              width: 32,
              lineHeight: '32px',
              fontSize: 20,
              borderRadius: 4,
              marginRight: 16,
            }}
          />
          链路概况
        </div>
      }
    >
      {dataSource.map((item) => (
        <div
          key={item.key}
          className="flex"
          style={{
            padding: '16px 0 8px 0',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div
            style={{
              color: 'var(--Netural-10, #8E8E8E)',
              fontSize: 13,
              width: 120,
            }}
          >
            {item.label}：
          </div>
          <div
            style={{
              flex: 1,
              color: 'var(--Netural-14, #424242)',
              fontSize: 13,
              wordBreak: 'break-all',
              fontWeight: 600,
            }}
          >
            {item.render
              ? item.render(state.details[item.key])
              : state.details[item.key]}
          </div>
        </div>
      ))}
    </Modal>
  );
};
export default connect(({ common }) => ({ ...common }))(SiderBasicInfo);
