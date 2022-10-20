import React, { useEffect, useState } from 'react';
import { Icon, Input, Empty, Spin, Pagination, Tag, Tooltip } from 'antd';
import { debounce } from 'lodash';
import { connect } from 'dva';
import BusinessActivityService from '../service';
import styles from '../index.less';
import classNames from 'classnames';

const ActivityLeftList = (props) => {
  const { initialId, currentId, onChangeId, currentPageIndex } = props;
  const [listQuery, setListQuery] = useState({
    current: currentPageIndex || 0,
    pageSize: 10,
    activityName: undefined as string,
  });

  const [listLoading, setListLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [total, setTotal] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const getBusinessTypeName = (type) => {
    return props?.dictionaryMap?.domain.find((x) => x.value === type)?.label;
  };
  const getActivityList = async (params) => {
    setListLoading(true);
    const {
      data: { data, success },
      headers: { totalCount },
    } = await BusinessActivityService.getBusinessActivityList(params);
    setListLoading(false);
    if (success && data) {
      // setListData(data.filter((x) => x.businessType !== 1));
      setListData(data);
      setTotal(+totalCount);
    }
  };

  useEffect(() => {
    getActivityList(listQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listQuery)]);

  useEffect(() => {
    // 滚动到当前活动
    if (
      Array.isArray(listData) &&
      listData.some((x) => String(x.activityId) === initialId)
    ) {
      setTimeout(() => {
        document.querySelector(`#activity_${initialId}`)?.scrollIntoView();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialId, JSON.stringify(listData)]);

  if (collapsed) {
    return (
      <div
        style={{
          textAlign: 'center',
          lineHeight: '54px',
          width: 40,
          height: '100%',
          backgroundColor: '#fff',
        }}
      >
        <Tooltip title="展开业务活动列表">
          <Icon
            type="menu-unfold"
            style={{ cursor: 'pointer' }}
            onClick={() => setCollapsed(false)}
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      style={{
        width: 224,
        paddingRight: 0,
        filter: 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.1))',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ marginTop: 8, padding: 8 }}>
          {window.history.length > 1 && (
            <a onClick={() => window.history.go(-1)}>
              <Icon type="left" style={{ marginRight: 8 }} /> 返回
            </a>
          )}
          <span className="flt-rt">
            <Tooltip title="收起业务活动列表">
              <Icon
                type="menu-fold"
                style={{ cursor: 'pointer', lineHeight: '24px' }}
                onClick={() => setCollapsed(true)}
              />
            </Tooltip>
          </span>
        </div>

        <div style={{ padding: 8 }}>
          <Input
            style={{ marginBottom: 8 }}
            suffix={undefined}
            prefix={<Icon type="search" />}
            placeholder="搜索链路"
            defaultValue={listQuery.activityName}
            onChange={debounce((e) => {
              setListQuery({
                ...listQuery,
                current: 0,
                activityName: e.target.value,
              });
            }, 200)}
          />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Spin spinning={listLoading} wrapperClassName={'spin-full'}>
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ flex: 1, overflow: 'auto' }}>
                {listData?.length > 0 ? (
                  listData.map((itemData) => {
                    const selected = currentId === String(itemData.activityId);
                    const isVirtual = itemData.businessType === 1;
                    const domainName = getBusinessTypeName(
                      itemData.businessDomain
                    );
                    return (
                      <div
                        id={`activity_${itemData.activityId}`}
                        key={itemData.activityId}
                        onClick={() => {
                          if (!isVirtual) {
                            onChangeId(String(itemData.activityId));
                          }
                        }}
                        className={classNames(styles['activity-item'], {
                          [styles.selected]: selected,
                          [styles.disabled]: isVirtual,
                        })}
                      >
                        <div className="flex" style={{ marginBottom: 8 }}>
                          <span className={styles['active-type-name']}>
                            {domainName && (
                              <span
                                style={{
                                  marginRight: 8,
                                }}
                              >
                                {domainName}
                              </span>
                            )}
                            {isVirtual && <Tag>虚拟</Tag>}
                          </span>

                          {
                            {
                              1: (
                                <span className="text-red-500 bg-white rounded px-2 py-1">
                                  配置异常
                                </span>
                              ),
                              2: (
                                <span className="text-primary-500 bg-white rounded px-2 py-1">
                                  链路压测中
                                </span>
                              ),
                              3: (
                                <span className="text-red-500 bg-white rounded px-2 py-1">
                                  配置变更
                                </span>
                              ),
                            }[itemData.status]
                          }
                        </div>
                        <div className={styles['active-name']}>
                          {itemData.activityName}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <Empty style={{ marginTop: 100 }} />
                )}
              </div>
              {total > listQuery.pageSize && (
                <div
                  style={{
                    backgroundColor: 'var(--Netural-02, #F8F8F8)',
                    padding: '8px 16px',
                    margin: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: 4,
                  }}
                >
                  <span>
                    <span style={{ color: 'var(--BrandPrimary-500, #26cdc3)' }}>
                      {Number(listQuery.current) + 1}
                    </span>
                    <span style={{ margin: '0 4px' }}>/</span>
                    {Math.ceil(total / listQuery.pageSize)}
                  </span>
                  <Pagination
                    className={styles['page-hide-item']}
                    itemRender={(current, type, originalElement) => {
                      if (type === 'page') {
                        return null;
                      }
                      return originalElement;
                    }}
                    current={Number(listQuery.current) + 1}
                    pageSize={listQuery.pageSize}
                    total={total}
                    onChange={(page) =>
                      setListQuery({ ...listQuery, current: page - 1 })
                    }
                  />
                </div>
              )}
            </div>
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default connect(({ common }) => ({ ...common }))(ActivityLeftList);
