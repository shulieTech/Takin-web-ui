import React, { useEffect } from 'react';
import SearchTable from 'src/components/search-table';
import { useStateReducer } from 'racc';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import getColumns from './components/PressureMeasurementConfigTable';
import getFormData from './components/PressureMeasurementConfigSearch';

interface PressureMeasurementConfigProps {}

export interface PressureMeasurementConfigState {
  isReload?: boolean;
}

const PressureMeasurementConfig: React.FC<PressureMeasurementConfigProps> = props => {
  const [state, setState] = useStateReducer<PressureMeasurementConfigState>({
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
export default PressureMeasurementConfig;
