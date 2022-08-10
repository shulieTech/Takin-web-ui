import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import CustomTable from './custom-table';
import useListService from 'src/utils/useListService';
import { CommonTableProps } from 'racc/dist/common-table/CommonTable';
import { Pagination } from 'antd';

interface Props extends CommonTableProps {
  service: (params: any) => Promise<any>;
  defaultQuery?: any;
}

/**
 * 使用service的table
 * @param props
 * @param ref 组件上定义ref，可以取到useListService返回的getList等属性，可以用来刷新列表
 * @returns
 */
const ServiceCustomTable = (props: Props, ref) => {
  const { service, defaultQuery, columns, ...rest } = props;

  const serviceOptions = useListService({
    service,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      ...defaultQuery,
    },
    isQueryOnMount: false,
  });

  const { list, loading, total, query, getList } = serviceOptions;

  // 转发内部的一些属性及方法
  useImperativeHandle(ref, () => serviceOptions, []);

  useEffect(() => {
    getList(defaultQuery);
  }, [defaultQuery]);

  return (
    <>
      <CustomTable
        {...rest}
        loading={loading}
        dataSource={list}
        columns={columns}
        pagination={false}
      />
      <Pagination
        style={{ marginTop: 20, textAlign: 'right' }}
        total={total}
        current={query.current + 1}
        pageSize={query.pageSize}
        showTotal={(t, range) =>
          `共 ${total} 条数据 第${query.current + 1}页 / 共 ${Math.ceil(
            total / (query.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) =>
          getList({ pageSize, current: current - 1 })
        }
        onShowSizeChange={(current, pageSize) =>
          getList({ pageSize, current: 0 })
        }
      />
    </>
  );
};

export default forwardRef(ServiceCustomTable);
