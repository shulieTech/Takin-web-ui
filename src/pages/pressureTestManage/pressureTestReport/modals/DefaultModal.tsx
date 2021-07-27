import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { customColumnProps } from 'src/components/custom-table/utils';
import PressureTestReportService from '../service';
import CustomTable from 'src/components/custom-table';
import { Typography, Tag, Tooltip, message, Icon, Row, Badge } from 'antd';
import copy from 'copy-to-clipboard';
import styles from './../index.less';
import CustomStatistic from 'src/components/custom-statistic/CustomStatistic';
import Header from '../components/Header';

interface Props {
  btnText: string | React.ReactNode;
  content: string | React.ReactNode;
}

const DefaultModal: React.FC<Props> = props => {
  return (
    <CommonModal
      modalProps={{
        footer: null
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
    >
      <div>{props.content}</div>
    </CommonModal>
  );
};
export default DefaultModal;
