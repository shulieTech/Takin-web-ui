import React, { Fragment, useEffect } from 'react';
import { CommonTable, useStateReducer } from 'racc';
import CustomTable from 'src/components/custom-table';
import TableTitle from 'src/common/table-title/TableTitle';
import { Divider, Alert } from 'antd';
import styles from './../index.less';
import getMiddleWareListColumns from './MiddleWareListTable';
import AppTrialManageService from '../service';

interface Props {
  id?: string;
  detailData?: any;
}
interface State {
  isReload: boolean;
  middleWareList: any[];
  loading: boolean;
}
const MiddleWareTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    middleWareList: null,
    loading: false
  });
  const { detailData, id } = props;

  useEffect(() => {
    queryMiddleWareList();
  }, [state.isReload]);

  /**
   * @name 获取中间件列表
   */
  const queryMiddleWareList = async () => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await AppTrialManageService.queryMiddleWareList({
      applicationId: id,
      pageNum: 0,
      pageSize: 0
    });
    if (success) {
      setState({
        middleWareList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  return (
    <div className={styles.tableWrap}>
      <Alert
        message={
          <p className={styles.alertMessage}>
            请确认以下中间件信息是否有「遗漏」或者「未生效」情况，如有以上情况，请联系数列人员处理
          </p>}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <TableTitle title="中间件列表" />
      <Divider />
      <CustomTable
        loading={state.loading}
        columns={getMiddleWareListColumns(state, setState)}
        dataSource={state.middleWareList ? state.middleWareList : []}
      />
    </div>
  );
};
export default MiddleWareTable;
