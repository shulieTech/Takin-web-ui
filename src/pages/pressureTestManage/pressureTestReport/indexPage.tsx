/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';

import getPressureTestReportColumns from './components/PressureTestReportColumn';
import getPressureTestReportFormData from './components/PressureTestReportFormData';
import { Button } from 'antd';
import router from 'umi/router';
interface PressureTestReportProps {
  location?: { query?: any };
}

export interface PressureTestReportState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
  batchSelectedKeys: number[];
  sameScenceId: string | number; // 只能对比选择同一个场景的报告
}

const PressureTestReport: React.FC<PressureTestReportProps> = (props) => {
  const [state, setState] = useStateReducer<PressureTestReportState>({
    isReload: false,
    searchParams: {
      ...props.location.query,
      current: Number(props.location.query?.current) ||  0,
      pageSize: Number(props.location.query?.pageSize) || 10,
    },
    batchSelectedKeys: [],
    sameScenceId: undefined,
  });

  return (
    <Fragment>
      <SearchTable
        tableAction={
          <Button
            type="primary"
            disabled={!(state.batchSelectedKeys?.length > 1)}
            onClick={() => {
              router.push({
                pathname: '/pressureTestManage/pressureTestReport/compare',
                query: {
                  sceneId: state.sameScenceId,
                  reportIds: state.batchSelectedKeys,
                }
              });
            }}
          >
            报告对比
          </Button>
        }
        commonTableProps={{
          rowKey: 'id',
          columns: getPressureTestReportColumns(state, setState),
          rowSelection: {
            type: 'checkbox',
            // hideDefaultSelections: true,
            columnTitle: ' ',
            selectedRowKeys: state.batchSelectedKeys,
            getCheckboxProps: (record) => {
              const isDiffrentScene = state.sameScenceId ? record.sceneId !== state.sameScenceId : false;
              const isSelected = state.batchSelectedKeys.includes(record.id);
              return {
                disabled: isDiffrentScene || (!isSelected && state.batchSelectedKeys.length > 4),
              };
            },
            onChange: (selectedKeys, selectedRows) => {
              if (!state.sameScenceId) {
                setState({
                  sameScenceId: selectedRows[0].sceneId,
                });
              }
              if (selectedKeys.length === 0) {
                setState({
                  sameScenceId: undefined,
                });
              }
              setState({
                batchSelectedKeys: selectedKeys.slice(0, 5),
              });
            },
          },
        }}
        commonFormProps={{
          formData: getPressureTestReportFormData(),
          rowNum: 4,
        }}
        ajaxProps={{ url: '/report/listReport', method: 'GET' }}
        searchParams={state.searchParams}
        toggleRoload={state.isReload}
        datekeys={[
          {
            originKey: 'time',
            separateKey: ['startTime', 'endTime'],
          },
        ]}
      />
    </Fragment>
  );
};
export default PressureTestReport;