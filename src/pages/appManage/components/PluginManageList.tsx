import React, { Fragment, useEffect } from 'react';
import { useStateReducer } from 'racc';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import AppManageService from '../service';
import getPluginManageListColumns from './PluginManageListColumn';

interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: string;
}
interface State {
  isReload: boolean;
  pluginManageList: any[];
  loading: boolean;
}
const PluginManageList: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    pluginManageList: null,
    loading: false
  });

  const { id } = props;

  useEffect(() => {
    queryPuginManageList({});
  }, [state.isReload]);

  /**
   * @name 获取插件列表
   */
  const queryPuginManageList = async values => {
    setState({
      loading: true
    });
    const {
      data: { success, data }
    } = await AppManageService.queryPuginManageList({
      applicationId: id,
      ...values
    });
    if (success) {
      setState({
        pluginManageList: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  return (
    <Fragment>
      <div
        className={styles.tableWrap}
        style={{ height: document.body.clientHeight - 160 }}
      >
        <CustomTable
          rowKey={(row, index) => index.toString()}
          loading={state.loading}
          columns={getPluginManageListColumns(state, setState, id)}
          dataSource={state.pluginManageList ? state.pluginManageList : []}
        />
      </div>
    </Fragment>
  );
};
export default PluginManageList;
