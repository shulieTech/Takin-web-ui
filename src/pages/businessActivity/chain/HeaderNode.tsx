import { Button, Dropdown, Menu, Icon, Switch, Tooltip } from 'antd';
import React, { useContext, useState } from 'react';
import { BusinessActivityDetailsContext } from '../detailsPage';
import styles from '../index.less';
import { MapUserAuthority } from 'src/utils/utils';
import { router } from 'umi';
import FlowVerificateModal from '../modals/FlowVerificateModal';
import ErrorListModal from './ErrorListModal';
import { FLOW_TYPE_ENUM } from 'src/constants';
import moment from 'moment';

interface Props {
  onChangeBottleStatus?: (status: number) => void;
}
const HeaderNode: React.FC<Props> = (props) => {
  const { state, setState } = useContext(BusinessActivityDetailsContext);
  const [showErrorList, setShowErrorList] = useState(false);

  const hasError = state?.details?.topology?.exceptions?.length > 0;

  return (
    <div
      style={{
        boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: 4,
        margin: 8,
        padding: 16,
        backgroundColor: '#fff',
        display: 'flex',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          lineHeight: '56px',
          textAlign: 'center',
          borderRadius: 4,
          marginRight: 16,
          backgroundColor: 'var(--BrandPrimary-500, #00CDC3)',
        }}
      >
        <span
          className="iconfont icon-xiaoxiduilie"
          style={{
            color: '#fff',
            fontSize: 24,
          }}
        />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <div style={{ flex: 1, display: 'flex' }}>
          <div
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--Netural-15, #313131)',
            }}
          >
            业务活动详情
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* <Popover content={<div>规则说明</div>}>
          规则说明{' '}
          <span
            className="iconfont icon-jieshi-3"
            style={{
              verticalAlign: 'middle',
              color: 'var(Netural-12,#666666)',
            }}
          />
        </Popover> */}
            <span style={{ marginLeft: 16 }}>
              {state?.details?.refreshTime && (
                <span style={{ marginRight: 8 }}>
                  最后统计时间：
                  {moment(state?.details?.refreshTime).format('HH:mm:ss')}
                </span>
              )}
              5秒刷新一次
              <Switch
                size="small"
                style={{ marginLeft: 8 }}
                checked={state.refreshTime > 0}
                onChange={(val) => {
                  setState({
                    refreshTime: val ? 5000 : 0,
                  });
                }}
              />
            </span>
            <Icon
              title="刷新"
              spin={state.detailLoading}
              type="sync"
              style={{
                cursor: 'pointer',
                marginLeft: 8,
              }}
              onClick={() => {
                if (!state.detailLoading) {
                  setState({ reload: state.reload + 1 });
                }
              }}
            />
            <Dropdown
              overlay={
                <Menu>
                  {Object.entries(FLOW_TYPE_ENUM).map(([key, title]) => (
                    <Menu.Item
                      key={key}
                      style={{
                        fontWeight:
                          state.queryParams.flowTypeEnum === key
                            ? 'bold'
                            : 'normal',
                      }}
                      onClick={() =>
                        setState({
                          queryParams: {
                            ...state.queryParams,
                            flowTypeEnum: key,
                          },
                        })
                      }
                    >
                      {title}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button style={{ marginLeft: 16 }}>
                流量类型： {FLOW_TYPE_ENUM[state.queryParams.flowTypeEnum]}
                <Icon style={{ marginLeft: 8 }} type="caret-down" />
              </Button>
            </Dropdown>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => setState({ baseInfoVisible: true })}
                  >
                    链路概况
                  </Menu.Item>
                  {MapUserAuthority('scriptManage') && (
                    <Menu.Item>
                      <FlowVerificateModal
                        id={state.details.activityId}
                        btnProps={{
                          type: 'link',
                          style: { color: 'rgba(0, 0, 0, 0.65)' },
                        }}
                      />
                    </Menu.Item>
                  )}
                  {MapUserAuthority('debugTool_linkDebug') && (
                    <Menu.Item
                      onClick={() => {
                        // @ts-ignore
                        window.g_app._store.dispatch({
                          type: 'app/updateState',
                          payload: {
                            debugToolId: state.details.activityId.toString(),
                          },
                        });
                        router.push(`/pro/debugTool/linkDebug`);
                      }}
                    >
                      去调试
                    </Menu.Item>
                  )}
                </Menu>
              }
            >
              <Button
                style={{
                  marginLeft: 16,
                  width: 32,
                  padding: 0,
                  textAlign: 'center',
                }}
              >
                <Icon type="more" />
              </Button>
            </Dropdown>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 4,
            alignItems: 'center',
            flex: 1,
          }}
        >
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                color: 'var(--Netural-10, #8e8e8e)',
              }}
            >
              业务活动名称：
            </span>
            <Tooltip title={state.details.activityName}>
              {state.details.activityName}
            </Tooltip>
          </div>
          <div
            style={{ marginLeft: 16, whiteSpace: 'nowrap', marginRight: 16 }}
          >
            <span
              style={{
                color: 'var(--Netural-10, #8e8e8e)',
              }}
            >
              配置状态：
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  marginRight: 8,
                  backgroundColor: hasError ? '#ED6047' : '#00D77D',
                  borderRadius: '100%',
                }}
              />
              {hasError ? (
                <span>
                  异常
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    onClick={() => {
                      setShowErrorList(true);
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    详情
                  </a>
                </span>
              ) : (
                '正常'
              )}
              <ErrorListModal
                visible={showErrorList}
                onCancel={() => setShowErrorList(false)}
              />
            </span>

            {state.details.topology.hasL2Bottleneck &&
              state.details.topology.l2bottleneckNum > 0 && (
                <span style={{ marginLeft: 16 }}>
                  <span
                    style={{
                      color: 'var(--Netural-10, #8e8e8e)',
                    }}
                  >
                    严重瓶颈：
                  </span>
                  <span
                    style={{
                      color: 'var(--FunctionalError-500, #ED6047)',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setState({
                        watchListVisible: true,
                        watchListQuery: {
                          // ...state.watchListQuery,
                          bottleneckStatus: 2,
                          nodeId: undefined,
                          bottleneckType: -1,
                          serviceName: undefined,
                        },
                      });
                    }}
                  >
                    {state.details.topology.l2bottleneckNum}
                  </span>
                </span>
              )}

            {state.details.topology.hasL1Bottleneck &&
              state.details.topology.l1bottleneckNum > 0 && (
                <span style={{ marginLeft: 16 }}>
                  <span
                    style={{
                      color: 'var(--Netural-10, #8e8e8e)',
                    }}
                  >
                    一般瓶颈：
                  </span>
                  <span
                    style={{
                      color: 'var(--FunctionalAlert-500, #FFA800)',
                      fontWeight: 700,
                      fontSize: 16,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setState({
                        watchListVisible: true,
                        watchListQuery: {
                          // ...state.watchListQuery,
                          bottleneckStatus: 1,
                          nodeId: undefined,
                          bottleneckType: -1,
                          serviceName: undefined,
                        },
                      });
                    }}
                  >
                    {state.details.topology.l1bottleneckNum}
                  </span>
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeaderNode;
