import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import getColumns from './components/PressureMeasurementRecordTable';
import getFormData from './components/PressureMeasurementRecordSearch';

interface PressureMeasurementRecordProps {}

export interface PressureMeasurementRecordState {
  isReload?: boolean;
}

const PressureMeasurementRecord: React.FC<PressureMeasurementRecordProps> = props => {
  const [state, setState] = useStateReducer<PressureMeasurementRecordState>({
    isReload: false
  });

  return (
    <SearchTable
      commonTableProps={{
        columns: getColumns(state, setState),
        size: 'small'
      }}
      commonFormProps={{ formData: getFormData(), rowNum: 6 }}
      ajaxProps={{ url: '/console/link/guard/guardmanage', method: 'GET' }}
      toggleRoload={state.isReload}
      datekeys={[
        {
          originKey: 'time',
          separateKey: ['startTime', 'endTime']
        }
      ]}
    />
  );
};
export default PressureMeasurementRecord;
