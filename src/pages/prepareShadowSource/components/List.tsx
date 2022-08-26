import React, { useState, useEffect, useContext } from 'react';
import { Icon, Input, Pagination, Tooltip, Button, Spin, Empty } from 'antd';
import useListService from 'src/utils/useListService';
import service from '../service';
import { PrepareContext } from '../indexPage';
import classNames from 'classnames';
import styles from '../index.less';
import { LINK_STATUS } from '../contants';

export default (props) => {
  const { currentLink, setCurrentLink } = useContext(PrepareContext);
  const { list, loading, total, query, getList } = useListService({
    service: service.getLinkList,
    defaultQuery: {
      current: 0,
      pageSize: 10,
    },
    // isQueryOnMount: false,
  });

  return (
    <div>
      <div style={{ padding: 16 }}>
        链路
        <Tooltip title="1111">
          <Icon
            type="question-circle"
            className="pointer"
            style={{ marginLeft: 4 }}
          />
        </Tooltip>
        <span className="flt-rt">
          <Button size="small" style={{ width: 24, padding: 0 }}>
            <Icon type="plus" />
          </Button>
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <Input.Search
          placeholder="搜索链路名称"
          onSearch={(val) =>
            getList({
              queryName: val?.trim(),
            })
          }
        />
      </div>
      <div>
        <Spin spinning={loading}>
          {total === 0 && !query.queryName && (
            <div
              style={{
                textAlign: 'center',
                padding: '70px 40px',
                lineHeight: '24px',
                color: 'var(--Netural-800, ##5A5E62)',
              }}
            >
              <Empty
                description={
                  <span>
                    当前列表还是空的哦 <br />
                    试着创建一个链路吧
                  </span>
                }
              />
            </div>
          )}
          {list.map((x) => {
            return (
              <div
                key={x.id}
                className={classNames(styles['link-item'], {
                  [styles.active]: x.id === parseInt(currentLink?.id, 10),
                })}
                onClick={() => {
                  setCurrentLink(x);
                }}
              >
                <div style={{ display: 'flex' }}>
                  <div
                    className="truncate"
                    style={{
                      flex: 1,
                      color: 'var(--Netural-850, #414548)',
                      marginBottom: 8,
                    }}
                  >
                    {x.title || '-'}
                  </div>
                  <span
                    style={{
                      color: 'var(--Netural-700, #6F7479)',
                      fontSize: 12,
                      marginLeft: 8,
                    }}
                  >
                    {LINK_STATUS[x.status]}
                  </span>
                </div>
                <div>
                  <span
                    style={{
                      color: 'var(--Netural-600, #90959A)',
                      marginRight: 8,
                    }}
                  >
                    ID:{x.id}
                  </span>

                  <span className={styles['icon-chuan']} />
                  <span
                    style={{
                      color: 'var(--BrandPrimary-500, #0fbbd5)',
                    }}
                  >
                    23
                  </span>
                </div>
              </div>
            );
          })}
          <Pagination
            style={{
              padding: 16,
              textAlign: 'center',
            }}
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
        </Spin>
      </div>
    </div>
  );
};
