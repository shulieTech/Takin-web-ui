import React, { Fragment } from 'react';
import { CommonDrawer, CommonTable } from 'racc';
import getReportListSearchFormData from './ReportListSearch';
import getReportListColumns from './ReportListTable';
import DrawerSearchTable from 'src/components/drawer-search-table';
interface Props {
  title?: string;
}
const ReportList: React.FC<Props> = props => {
  const { title } = props;
  return (
    <CommonDrawer
      btnText={title}
      drawerProps={{ width: 650, maskClosable: false, title: '报告详情' }}
      footer={null}
      btnProps={{
        type: 'link',
        style: {
          color: '#21D0F4',
          fontSize: 12,
          padding: 0,
          height: 0
        }
      }}
    >
      <DrawerSearchTable
        commonTableProps={{
          columns: getReportListColumns(),
          size: 'small'
        }}
        commonFormProps={{ formData: getReportListSearchFormData(), rowNum: 2 }}
        ajaxProps={{ url: '/console/link/guard/guardmanage', method: 'GET' }}
      />
    </CommonDrawer>
  );
};
export default ReportList;
