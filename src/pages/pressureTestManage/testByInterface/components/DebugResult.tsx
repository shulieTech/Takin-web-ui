import React, { useState, useEffect } from 'react';
import { Select, Icon, Tree, Pagination } from 'antd';
import service from '../service';
import useListService from 'src/utils/useListService';

interface Props {
  detail: any;
  debugId?: number | string;
}

const DebugResult: React.FC<Props> = (props) => {
  const { debugId, detail } = props;
  const [result, setResult] = useState();

  const { query, total, list, getList, loading } = useListService({
    service: service.getDebugResult,
    defaultQuery: {
      id: debugId,
      senceId: detail?.id,
      current: 0,
      pageSize: 10,
    },
    afterSearchCallback: (res) => {
      // 轮询结果
      if (res.data.success && res.data.data.status === 1) {
        getList();
      }
    },
  });

  const getDebugResult = async () => {
    const {
      data: { success, data },
    } = await service.getDebugResult({ id: debugId, senceId: detail?.id });
    if (success) {
      setResult(data);
      if (data.status === 1) {
        setTimeout(() => {
          getDebugResult();
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (debugId) {
      getDebugResult();
    }
  }, [debugId]);

  return (
    <div>
      <div
        style={{
          padding: '8px 0',
          borderTop: '1px solid #EEF0F2',
          color: 'var(--Netural-500, #AEB2B7)',
        }}
      >
        响应结果
        <div style={{ float: 'right', color: 'var(--Netural-850, #414548)' }}>
          <span style={{ marginRight: 32 }}>
            <Icon
              type="close-circle"
              theme="filled"
              style={{ color: '#D64C42', marginRight: 8 }}
            />
            1 失败
          </span>
          <span style={{ marginRight: 32 }}>
            <Select
              allowClear
              placeholder="状态"
              onChange={(val) =>
                getList({
                  status: val,
                })
              }
            >
              <Select.Option value={1}>成功</Select.Option>
              <Select.Option value={2}>失败</Select.Option>
            </Select>
          </span>
        </div>
      </div>
      {!result ? (
        <div
          style={{
            color: 'var(--Netural-800, #5A5E62)',
            lineHeight: '20px',
            textAlign: 'center',
            padding: '40px 0',
          }}
        >
          您可以输入一个URL，点击调
          <br />
          试后，可在此查看响应结果
        </div>
      ) : (
        <div
          style={{
            borderTop: '1px solid #EEF0F2',
          }}
        >
          {list.map((x) => {
            return <div key={x.id}>1111</div>;
          })}
          <Pagination
            simple
            hideOnSinglePage
            size="small"
            total={total}
            pageSize={query.pageSize}
            current={query.current + 1}
            onChange={(page, pageSize) => {
              getList({ pageSize, current: page - 1 });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DebugResult;
