import React, { Fragment } from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import { Button } from 'antd';
import CustomTable from 'src/components/custom-table/CustomTable';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';

interface Props {}

const ToolDownload: React.FC<Props> = props => {

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '工具名称',
        dataIndex: '1',
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return <a  href='' download>下载</a>;
        }
      }
    ];
  };

  return (
    <Fragment>
      <BasePageLayout title="工具下载">
        <CustomTable columns={getColumns()} dataSource={[{ a: '1' }]}/>
      </BasePageLayout>
    </Fragment>
  );
};
export default ToolDownload;
