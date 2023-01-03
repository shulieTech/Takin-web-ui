import React, { useEffect, useState, Fragment } from 'react';
import SearchTable from 'src/components/search-table';

import { useStateReducer } from 'racc';

import getPressureTestReportColumns from './components/PressureTestReportColumn';
import getPressureTestReportFormData from './components/PressureTestReportFormData';

interface PressureTestReportProps {
  location?: { query?: any };
}

export interface PressureTestReportState {
  isReload?: boolean;
  searchParams: {
    current: string | number;
    pageSize: string | number;
  };
}

const PressureTestReport: React.FC<PressureTestReportProps> = props => {
  const [state, setState] = useStateReducer<PressureTestReportState>({
    isReload: false,
    searchParams: {
      current: 0,
      pageSize: 10,
      ...props.location.query,
    },
  });

  return (
    <Fragment>
      <SearchTable
        commonTableProps={{
          columns: getPressureTestReportColumns(state, setState)
        }}
        commonFormProps={{
          formData: getPressureTestReportFormData(),
          rowNum: 4
        }}
        ajaxProps={{ url: '/report/listReport', method: 'GET' }}
        searchParams={state.searchParams}
        toggleRoload={state.isReload}
        datekeys={[
          {
            originKey: 'time',
            separateKey: ['startTime', 'endTime']
          }
        ]}
      />
    </Fragment>
  );
};
export default PressureTestReport;
