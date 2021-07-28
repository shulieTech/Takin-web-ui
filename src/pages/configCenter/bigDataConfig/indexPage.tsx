/**
 * @name
 * @author MingShined
 */
import { Icon, Tooltip } from 'antd';
import { useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import SearchTable from 'src/components/search-table';
import getColumns from './components/TableNode';
import TableAction from './components/TableAction';
interface Props {}
const getInitState = () => ({
  reload: false
});
export type BigDataConfigState = ReturnType<typeof getInitState>;
const BigDataConfig: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<BigDataConfigState>(getInitState());
  const title: React.ReactNode = (
    <Fragment>
      开关配置
      <Tooltip title="开关配置可控制大数据中心的相关配置信息，如采集率、插件开关等">
        <Icon className="mg-l1x" type="question-circle" />
      </Tooltip>
    </Fragment>
  );
  return (
    <Fragment>
      <SearchTable
        commonTableProps={{
          columns: getColumns(state, setState),
          size: 'small'
        }}
        title={title}
        // commonFormProps={{ formData: getFormData(state, setState), rowNum: 6 }}
        tableAction={<TableAction state={state} setState={setState} />}
        ajaxProps={{ url: '/pradar/switch/list', method: 'GET' }}
        toggleRoload={state.reload}
      />
    </Fragment>
  );
};
export default BigDataConfig;
