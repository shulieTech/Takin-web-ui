import React, { Fragment, useEffect } from 'react';
import LinkDbTable from './LinkDbTable';
import { useStateReducer } from 'racc';
import AppManageService from '../service';
interface Props {
  id?: string;
  detailData?: any;
  detailState?: any;
  action?: any;
}
const DbAndTable: React.FC<Props> = props => {
  const [state, setState] = useStateReducer({
    dataSource: null,
    // planType: null,
    isReload: false,
    loading: false
  });
  const { detailState, action } = props;

  useEffect(() => {
    queryList();
  }, [state.isReload]);

  /**
   * @name 获取影子库表列表
   */
  const queryList = async () => {
    setState({
      loading: true
    });
    const {
      data: { data, success }
    } = await AppManageService.queryDbAndTableList({ applicationId: props.id });
    if (success) {
      setState({
        // planType: data.planType,
        dataSource: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  return (
    <LinkDbTable
      detailState={detailState}
      setState={setState}
      state={state}
      id={props.id}
      detailData={props.detailData}
      action={action}
    />
  );
};
export default DbAndTable;
