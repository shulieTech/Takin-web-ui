import React, { useState, useEffect } from 'react';
import { Select, Table, Tooltip } from 'antd';
import { SchemaField, FormPath, Schema, IFieldMergeState } from '@formily/antd';
import services from '../service';

const { Option } = Select;

const ExcludeApps = (props: IFieldMergeState) => {
  const [appList, setAppList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { value = [], schema, className, editable, path, mutators } = props;
  const componentProps = schema.getExtendsComponentProps() || {};
  const { flowId, ...rest } = componentProps;

  const [queryParams, setQueryParams] = useState({
    businessFlowIds: [flowId],
    applicationName: undefined,
    current: 0,
    pageSize: 10,
  });

  const getAppList = async () => {
    setLoading(true);
    const {
      data: { success, data },
      headers: { 'x-total-count': totalCount },
    } = await services.applicationList(queryParams);
    setLoading(false);
    if (success) {
      setAppList(data);
      setTotal(totalCount);
    }
  };

  const toggleIgnore = (applicationId, includedIndex) => {
    const _value = value.concat();
    if (includedIndex > -1) {
      _value.splice(includedIndex, 1);
    } else {
      _value.push(applicationId);
    }
    mutators.change(_value);
  };

  const columns = [
    {
      title: '应用',
      dataIndex: 'applicationName',
      render: (text) => {
        return (
          <Tooltip title={text}>
            <div
              style={{
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {text}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'applicationId',
      width: 80,
      render: (text, record, index) => {
        const includedIndex = value.findIndex((x) => x === text);
        return editable ? (
          <a onClick={() => toggleIgnore(text, includedIndex)}>
            {includedIndex > -1 ? '取消忽略' : '忽略'}
          </a>
        ) : includedIndex > -1 ? (
          '已忽略'
        ) : (
          '-'
        );
      },
    },
  ];

  useEffect(() => {
    getAppList();
  }, [JSON.stringify(queryParams)]);

  return (
    <>
      {editable && (
        <Select
          placeholder="服务"
          allowClear
          showSearch
          optionFilterProp="children"
          onChange={(val: any) => {
            setQueryParams({
              ...queryParams,
              applicationName: val,
              current: 0,
            });
          }}
          loading={loading}
        >
          {appList.map((x) => (
            <Option key={x.applicationId} value={x.applicationName}>
              {x.applicationName}
            </Option>
          ))}
        </Select>
      )}
      <Table
        size="small"
        columns={columns}
        dataSource={appList}
        loading={loading}
        pagination={{
          total,
          current: queryParams.current + 1,
          pageSize: queryParams.pageSize,
          simple: true,
          onChange: (current, pageSize) =>
            setQueryParams({
              ...queryParams,
              pageSize,
              current: current - 1,
            }),
        }}
        footer={() => (
          <span>
            已忽略<strong>{value?.length}</strong>个应用
            {value?.length > 0 && editable && (
              <>
                ，
                <a
                  onClick={() => {
                    mutators.change([]);
                  }}
                >
                  清空选择
                </a>
              </>
            )}
          </span>
        )}
      />
    </>
  );
};

ExcludeApps.isFieldComponent = true;

export default ExcludeApps;
