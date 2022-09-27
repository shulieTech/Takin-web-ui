import React, { useState, useEffect, useContext, useRef } from 'react';
import { Icon, Button, Table, Input, Dropdown } from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import StatusDot from './StatusDot';
import { PrepareContext } from '../indexPage';

const DropdowTable = (props) => {
  const { defaultList = [] } = props;
  const [list, setList] = useState(defaultList);

  const filterList = (e) => {
    if (e.target.value && e.target.value.trim()) {
      setList(
        defaultList.filter(
          (x) => x.businessDataBase.indexOf(e.target.value.trim()) > -1
        )
      );
    } else {
      setList(defaultList);
    }
  };
  return (
    <div
      style={{
        width: 475,
        padding: 8,
        background: '#fff',
        boxShadow:
          '0px 4px 14px rgba(68, 68, 68, 0.1), 0px 2px 6px rgba(68, 68, 68, 0.1)',
      }}
    >
      <Input.Search
        placeholder="搜索数据源"
        style={{
          marginBottom: 8,
        }}
        onChange={filterList}
      />
      <Table
        size="small"
        showHeader={false}
        rowKey="id"
        dataSource={list}
        columns={[
          {
            dataIndex: 'businessDataBase',
          },
          {
            dataIndex: 'status',
            width: 20,
            fixed: 'right',
            render: (text) => {
              return {
                0: <StatusDot title="未检测" />,
                1: (
                  <StatusDot
                    color="var(--FunctionNegative-500, #D24D40)"
                    title="检测失败"
                  />
                ),
                2: (
                  <StatusDot
                    color="var(--FunctionPositive-300, #2DC396)"
                    title="检测成功"
                  />
                ),
              }[text];
            },
          },
        ]}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

interface Props {
  isolateListRefreshKey: number;
}

export default (props: Props) => {
  const inputSearchRef = useRef();
  const { prepareState, setPrepareState } = useContext(PrepareContext);

  const { list, loading, total, query, getList, resetList } = useListService({
    service: service.appViewMode,
    defaultQuery: {
      current: 0,
      pageSize: 10,
      queryAppName: undefined,
      resourceId: prepareState.currentLink.id,
    },
    isQueryOnMount: false,
  });

  const columns = [
    {
      title: '应用',
      dataIndex: 'appName',
      render: (text, record) => {
        return (
          <div style={{ display: 'inline-flex' }}>
            <div
              style={{
                width: 40,
                lineHeight: '38px',
                height: 40,
                textAlign: 'center',
                border: '1px solid var(--Netural-200, #E5E8EC)',
                borderRadius: 16,
                marginRight: 24,
              }}
            >
              <span
                className="iconfont icon-huancun1"
                style={{
                  fontSize: 18,
                  color: 'var(--Netural-1000, #141617)',
                }}
              />
            </div>
            <div>
              <div
                style={{
                  color: 'var(--Netural-1000, #141617)',
                }}
              >
                {text}
              </div>
              <div
                style={{
                  color: 'var(--Netural-600, #90959A)',
                }}
              >
                ID:{record.id}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '所属数据源',
      align: 'right',
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'right' }}>
            {record.dsList?.[0]?.businessDataBase}
            <div style={{ marginTop: 8 }}>
              <Dropdown overlay={<DropdowTable defaultList={record.dsList} />}>
                <a>共{record.dsList.length}个</a>
              </Dropdown>
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getList();
  }, [props.isolateListRefreshKey]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 32px',
        }}
      >
        <div style={{ flex: 1 }}>
          <Input.Search
            ref={inputSearchRef}
            placeholder="搜索应用"
            onSearch={(val) =>
              getList({
                queryAppName: val,
                current: 0,
              })
            }
            style={{
              width: 260,
            }}
          />
        </div>
        <div>
          <Button
            type="link"
            onClick={() => {
              resetList();
              inputSearchRef?.current?.input?.setValue();
            }}
            disabled={loading}
          >
            重置
          </Button>
          <Button
            style={{ width: 32, padding: 0, marginLeft: 32 }}
            onClick={() => getList()}
            disabled={loading}
          >
            <Icon type="sync" spin={loading} />
          </Button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Table
          columns={columns}
          dataSource={list}
          pagination={{
            total,
            pageSize: query.pageSize,
            current: query.current + 1,
            hideOnSinglePage: true,
            onChange: (page, pageSize) =>
              getList({
                pageSize,
                current: page - 1,
              }),
            style: { marginRight: 60 },
          }}
          loading={loading}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </div>
    </>
  );
};
