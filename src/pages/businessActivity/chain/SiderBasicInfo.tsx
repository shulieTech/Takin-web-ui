/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import React, { Fragment, useContext } from 'react';
import { CommonModelState } from 'src/models/common';
import { BusinessActivityDetailsContext } from '../detailsPage';
import { ActivityBean } from '../enum';
interface Props extends CommonModelState {}
const SiderBasicInfo: React.FC<Props> = props => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const dataSource = [
    {
      label: '所属应用',
      key: ActivityBean.所属应用
    },
    {
      label: '服务类型',
      key: ActivityBean.服务类型
    },
    {
      label: '服务/入口',
      key: ActivityBean['服务/入口']
    },
    {
      label: '业务活动名称',
      key: ActivityBean.业务活动名称
    },
    // {
    //   label: '业务活动类型',
    //   key: ActivityBean.业务活动类型,
    //   render: text => props.dictionaryMap.isCore.find(item => +item.value === +text).label
    // },
    {
      label: '业务活动级别',
      key: ActivityBean.业务活动级别
    },
    // {
    //   label: '业务域',
    //   key: ActivityBean.业务域,
    //   render: text => props.dictionaryMap.domain.find(item => +item.value === +text).label
    // }
  ];
  return (
    <Fragment>
      {dataSource.map(item => (
        <div
          key={item.key}
          style={{
            padding: '16px 0',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <div style={{ color: '#7D7D7D', marginBottom: 8, fontSize: 13 }}>
            {item.label}：
          </div>
          <div style={{ color: '#434343', fontSize: 13, wordBreak: 'break-all', fontWeight: 600 }}>
            {item.render
              ? item.render(state.details[item.key])
              : state.details[item.key]}
          </div>
        </div>
      ))}
    </Fragment>
  );
};
export default connect(({ common }) => ({ ...common }))(SiderBasicInfo);
