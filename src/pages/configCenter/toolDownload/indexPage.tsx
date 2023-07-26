import React, { Fragment, useEffect, useState } from 'react';
import { BasePageLayout } from 'src/components/page-layout';
import CustomTable from 'src/components/custom-table/CustomTable';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import ToolDownloadService from './service';

interface Props {}

const ToolDownload: React.FC<Props> = props => {

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    toolDownload();
  }, []);

  /**
   * @name 获取工具下载链接
   */
  const toolDownload = async () => {
    const {
        data: { success, data }
      } = await ToolDownloadService.toolDownload({});
    if (success) {
      setDataSource(data);
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '工具名称',
        dataIndex: 'fileName',
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'downloadUrl',
        render: (text, row) => {
          return <a href={text} download>下载</a>;
        }
      }
    ];
  };

  return (
    <Fragment>
      <BasePageLayout title="工具下载">
        <CustomTable columns={getColumns()} dataSource={dataSource}/>
      </BasePageLayout>
    </Fragment>
  );
};
export default ToolDownload;
