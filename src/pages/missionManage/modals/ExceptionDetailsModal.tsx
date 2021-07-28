/**
 * @name
 * @author MingShined
 */
import { connect } from 'dva';
import { ColumnProps } from 'antd/lib/table';
import { Table } from 'antd';
import moment from 'moment';
import { CommonModal, useStateReducer, CommonTable, defaultColumnProps } from 'racc';
import React, { useEffect } from 'react';
import { CommonModelState } from 'src/models/common';
import MissionManageService from '../service';
interface Props extends CommonModelState {
  btnText: string;
  onSuccess: () => void;
  id?: string;
}
const ExceptionDetailsModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    patrolDashbordDataSource: null,
    dataSource: [],
    total: 0,
    searchParams: {
      current: 0,
      pageSize: 10
    },
  });
 
  const getDetails = async () => {
    const {
       data: { data, success }
     } = await MissionManageService.sceneException({
       patrolSceneId: props.id,
     });
    if (success) {
      setState({ dataSource: data });
    }
  };
 
  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...defaultColumnProps,
        title: '异常编码',
        dataIndex: 'errorCode',
      },
      {
        ...defaultColumnProps,
        title: '业务活动',
        dataIndex: 'activityName'
      },
      {
        ...defaultColumnProps,
        title: '应用',
        dataIndex: 'appName'
      },
      {
        ...defaultColumnProps,
        title: '异常描述',
        width: 200,
        dataIndex: 'errorDescription'
      },
      {
        ...defaultColumnProps,
        title: '异常详情',
        width: 300,
        dataIndex: 'errorDetail'
      },
      {
        ...defaultColumnProps,
        title: '最新更新时间',
        dataIndex: 'modifyDate',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '--'
      }
    ];
  };
 
  const handleChange = (pageSize, current) => {
    setState({
      searchParams: {
        current,
        pageSize
      },
    });
  };
 
  return (
     <CommonModal
       modalProps={{ title: '查看异常详情', width: 1060, destroyOnClose: true, footer: null }}
       btnText={props.btnText}
       btnProps={{ type: 'link' }}
       onClick={getDetails}
     >
       <Table
         columns={getColumns()}
         dataSource={state.dataSource}
         style={{ background: 'none' }}
         pagination={{ pageSize: 10 }}
       />
     </CommonModal>
  );
};
export default connect(({ common }) => ({ ...common }))(ExceptionDetailsModal);
 