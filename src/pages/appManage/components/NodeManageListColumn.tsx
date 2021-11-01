/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import _ from 'lodash';
import { customColumnProps } from 'src/components/custom-table/utils';
import styles from './../index.less';
import TableIndex from 'src/common/table-index/TableIndex';
import { Badge, Button, Col, message, Modal, Row, Tag, Tooltip } from 'antd';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import AppManageService from '../service';
import InstallAgentModal from '../modals/InstallAgentModal';

const getNodeManageListColumns = (
  state,
  setState,
  detailData
): ColumnProps<any>[] => {
  /**
   * @name 卸载探针
   */
  const handleSubmit = async (agentId, applicationId) => {
    const {
      data: { data, success }
    } = await AppManageService.actionAgent({
      agentId,
      applicationId,
      operateType: 2
    });
    if (success) {
      message.success('正在卸载，请稍后……');
      setState({
        isReload: !state.isReload
      });
    }
  };
  const showConfirm = (appName, agentId, appId) => {
    Modal.confirm({
      title: (
        <div>
          <span className={styles.modalTitle}>卸载探针</span>
        </div>
      ),
      icon: null,
      content: `应用【${appName}】实例【${agentId}】现在处于【安装】状态，确认卸载探针吗？`,
      okType: 'danger',
      okText: '确认卸载',
      onOk() {
        handleSubmit(agentId, appId);
      }
    });
  };
  return [
    {
      ...customColumnProps,
      title: 'Agent ID',
      dataIndex: 'agentId',
      render: (text, row) => {
        return (
          <TableTwoRows
            prefix={
              row.probeStatus === 0 ? (
                <Tooltip
                  title="该节点未安装探针，请及时处理"
                  placement="bottom"
                >
                  <img
                    style={{ width: 20, marginTop: -2, marginRight: 4 }}
                    src={require('./../../../assets/explain_icon.png')}
                  />
                </Tooltip>
              ) : null
            }
            title={text}
            secondLineContent={[
              {
                label: 'IP:',
                value: row.ip
              },
              {
                label: '进程号:',
                value: row.processNumber
              }
            ]}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: 'Agent语言',
      dataIndex: 'agentLang',
      render: text => {
        return <Tag>{text}</Tag>;
      }
    },
    {
      ...customColumnProps,
      title: 'Agent 版本',
      dataIndex: 'agentVersion',
      render: (text, row) => {
        return text ? (
          <Tag
            color="#F8F8F8"
            style={{
              color: '#666666',
              fontWeight: 600
            }}
          >
            {text}
          </Tag>
        ) : (
          '-'
        );
      }
    },
    {
      ...customColumnProps,
      title: '探针版本号',
      dataIndex: 'probeVersion',
      render: (text, row) => {
        return text ? (
          <Tag
            color="#F8F8F8"
            style={{
              color: row.probeStatus === 0 ? '#ED6047' : '#666666',
              fontWeight: 600
            }}
          >
            {text}
          </Tag>
        ) : (
          '-'
        );
      }
    },
    {
      ...customColumnProps,
      title: '探针状态',
      dataIndex: 'probeStatus',
      render: (text, row) => {
        // 探针状态, 0 未安装, 1 安装中, 2 已安装 , 11 升级中, 21 卸载中，31 安装失败, 41 卸载失败
        if (text === 1 || text === 11 || text === 21) {
          return (
            <span>
              <img
                className={styles.spinloading}
                style={{ width: 15, marginRight: 4 }}
                src={require('./../../../assets/loading_icon.png')}
              />
              {row.probeStatusDesc}
            </span>
          );
        }
        return (
          <Fragment>
            <Badge
              text={row.probeStatusDesc}
              color={
                text === 0
                  ? '#C9C9C9'
                  : text === 2
                  ? '#11D0C5'
                  : text === 31 || text === 41
                  ? 'var(--FunctionalError-500)'
                  : ''
              }
            />
            {row.operateStatusDesc && (
              <p>
                <Tag
                  color="#FFF6F8"
                  style={{ color: '#ED6047', fontWeight: 500 }}
                >
                  {row.operateStatusDesc}
                </Tag>
              </p>
            )}
          </Fragment>
        );
      }
    },
    {
      ...customColumnProps,
      title: '更新时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        // 探针状态, 0 未安装, 1 安装中, 2 已安装 , 11 升级中, 21 卸载中，31 安装失败, 41 卸载失败
        return (
          <Fragment>
            {(row.probeStatus === 0 ||
              row.probeStatus === 31 ||
              row.probeStatus === 41) && (
              <InstallAgentModal
                btnText="安装"
                applicationName={detailData.applicationName}
                agentId={row.agentId}
                type={1}
                applicationId={detailData.id}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            )}
            {row.probeStatus === 2 && (
              <InstallAgentModal
                btnText="升级"
                applicationName={detailData.applicationName}
                agentId={row.agentId}
                type={3}
                applicationId={detailData.id}
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            )}
            {(row.probeStatus === 2 ||
              row.probeStatus === 1 ||
              row.probeStatus === 41) && (
              <Button
                type="link"
                style={{ marginLeft: 8 }}
                onClick={() =>
                  showConfirm(
                    detailData.applicationName,
                    row.agentId,
                    detailData.id
                  )
                }
              >
                卸载
              </Button>
            )}
          </Fragment>
        );
      }
    }
  ];
};

export default getNodeManageListColumns;
