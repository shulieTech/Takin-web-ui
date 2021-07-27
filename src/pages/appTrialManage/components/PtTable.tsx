import React, { Fragment, useEffect } from 'react';
import { CommonTable, useStateReducer } from 'racc';
import CustomTable from 'src/components/custom-table';
import TableTitle from 'src/common/table-title/TableTitle';
import { Divider, Alert, Button } from 'antd';
import styles from './../index.less';
import AppTrialManageService from '../service';
import EmptyNode from 'src/common/empty-node';
import getBusinessTableListColumns from './BusinessTableTable';
import getPtTableListColumns from './PtTableTable';

interface Props {
  id?: string;
  detailData?: any;
}
interface State {
  isReload: boolean;
  ptList: any[];
  tableList: any[];
  loading: boolean;
}
const PtTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    ptList: null,
    tableList: [],
    loading: false
  });
  const { detailData, id } = props;

  useEffect(() => {
    queryTableList();
    queryPtList();
  }, [state.isReload]);

  /**
   * @name 获取业务表
   */
  const queryTableList = async () => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await AppTrialManageService.queryTableList({
      applicationId: id,
      pageSize: 0,
      pageNum: 0
    });
    if (success) {
      setState({
        tableList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 获取影子表
   */
  const queryPtList = async () => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await AppTrialManageService.queryPtList({ applicationId: id });
    if (success) {
      setState({
        ptList: data.result,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  return state.ptList && state.ptList.length > 0 ? (
    <div className={styles.tableWrap}>
      <Alert
        message={
          <p className={styles.alertMessage}>
            请在压测前创建对应影子表（命名为“pt_原表名”），并重启应用。
          </p>}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />
      <TableTitle title="业务表" />
      <Divider />
      <CustomTable
        loading={state.loading}
        columns={getBusinessTableListColumns(state, setState)}
        dataSource={state.tableList ? state.tableList : []}
      />
      <div style={{ marginTop: 50 }}>
        <TableTitle title="影子表" />
        <Divider />
        <CustomTable
          loading={state.loading}
          columns={getPtTableListColumns(state, setState)}
          dataSource={state.ptList ? state.ptList : []}
        />
      </div>
    </div>
  ) : (
    <div style={{ marginTop: 50, marginBottom: 100 }}>
      <EmptyNode
        title="暂无影子表信息"
        desc={
          <p style={{ width: 348, display: 'inline-block' }}>
            执行一次请求脚本，可自动获取相关业务表，并生成影子表配置，
            具体步骤参考“压测体验文档”，完成操作后刷新查看
          </p>}
        extra={
          <div>
            <Button
              onClick={() => {
                setState({
                  isReload: !state.isReload
                });
              }}
            >
              刷新
            </Button>
          </div>
        }
      />
    </div>
  );
};
export default PtTable;
