import React, { useEffect, useState } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';
import getDataSourceConfigFormData from './components/DataSourceConfigSearch';
import getDataSourceConfigColumns from './components/DataSourceConfigTable';
import DataSourceConfigTableAction from './components/DataSourceConfigTableAction';
import DataSourceConfigService from './service';
import { connect } from 'dva';

interface DataSourceConfigProps {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  location?: any;
  dictionaryMap?: any;
}

export interface DataSourceConfigState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  tagList: any[];
}

const DataSourceConfig: React.FC<DataSourceConfigProps> = props => {
  const { dictionaryMap } = props;
  const [state, setState] = useStateReducer<DataSourceConfigState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10
    },
    tagList: null
  });

  useEffect(() => {
    queryTagList();
  }, [state.isReload]);

  /**
   * @name 获取所有标签列表
   */
  const queryTagList = async () => {
    const {
      data: { success, data }
    } = await DataSourceConfigService.queryTagList({});
    if (success) {
      setState({
        tagList:
          data &&
          data.map(item => {
            return { label: item.tagName, value: item.id };
          })
      });
    }
  };

  return (
    <SearchTable
      commonTableProps={{
        columns: getDataSourceConfigColumns(state, setState, dictionaryMap)
      }}
      commonFormProps={{
        formData: getDataSourceConfigFormData(state, dictionaryMap),
        rowNum: 6
      }}
      ajaxProps={{ url: '/datasource/list', method: 'POST' }}
      toggleRoload={state.isReload}
      tableAction={
        <DataSourceConfigTableAction
          state={state}
          setState={setState}
          dictionaryMap={dictionaryMap}
        />
      }
    />
  );
};

export default connect(({ common }) => ({ ...common }))(DataSourceConfig);
