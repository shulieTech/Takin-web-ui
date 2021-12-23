import React, { Fragment, useEffect } from 'react';
import { CommonModal, CommonTable, useStateReducer } from 'racc';
import styles from './../index.less';
import BusinessActivityService from '../service';
import {
  Button,
  Collapse,
  Icon,
  message,
  Popconfirm,
  Popover,
  Tooltip
} from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import { ColumnProps } from 'antd/lib/table';
import CustomTable from 'src/components/custom-table';
import AddDataSourceModal from './AddDataSourceModal';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';

interface Props {
  btnText?: string | React.ReactNode;
  dataSourceId?: number | string;
  onSccuess?: () => void;
  businessActivityId?: string;
}

interface State {
  isReload?: boolean;
  missingDataScriptList: any[];
}
const MissingDataScriptModal: React.FC<Props> = props => {
  const { businessActivityId } = props;
  const { Panel } = Collapse;
  const [state, setState] = useStateReducer<State>({
    isReload: false,
    missingDataScriptList: null
  });
  const { dataSourceId } = props;

  const handleClick = () => {
    queryMissingDataScriptList({
      businessActivityIds: [businessActivityId]
    });
  };

  /**
   * @name 获取漏数脚本配置列表
   */
  const queryMissingDataScriptList = async value => {
    const {
      data: { data, success }
    } = await BusinessActivityService.queryMissingDataScriptList({ ...value });
    if (success) {
      setState({
        missingDataScriptList: data
      });
    }
  };

  /**
   * @name 删除数据源
   */
  const handleDelete = async (id, datasourceId) => {
    const {
      data: { data, success }
    } = await BusinessActivityService.deleteDataSource({
      datasourceId,
      businessActivityId: id
    });
    if (success) {
      message.success('删除数据源成功！');
      queryMissingDataScriptList({
        businessActivityIds: [businessActivityId]
      });
    }
  };

  const customPanelStyle = {
    background: '#ffffff',
    borderRadius: 2,
    marginBottom: 8,
    border: '1px solid #F0F0F0',
    overflow: 'hidden'
  };

  const getMissingDataScriptColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        dataIndex: 'order',
        width: 80
      },
      {
        ...customColumnProps,
        title: '命令',
        dataIndex: 'sql'
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        width: 1200,
        title: (
          <span style={{ fontSize: '16px' }}>
            数据验证脚本设置
            <Tooltip
              trigger="click"
              title="数据验证脚本可在调试工具和压测试跑时执行数据验证命令，配置命令前请先在【仿真平台-数据源管理-数据源配置】中完善数据源配置。"
              placement="bottom"
            >
              <Icon style={{ marginLeft: 8 }} type="question-circle" />
            </Tooltip>
          </span>
        ),
        footer: null,
        maskClosable: false,
        centered: true
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <AddDataSourceModal
        btnText="添加数据源"
        action="add"
        businessActivityId={businessActivityId}
        onSccuess={() => {
          queryMissingDataScriptList({
            businessActivityIds: [businessActivityId]
          });
        }}
      />
      <div
        className={styles.missingDataWrap}
        style={{ height: 600, overflowY: 'scroll', marginTop: 16 }}
      >
        <Collapse
          defaultActiveKey={['0']}
          //   expandIconPosition="right"
          bordered={false}
        >
          {state.missingDataScriptList &&
            state.missingDataScriptList.map((item, k) => {
              return (
                <Panel
                  style={customPanelStyle}
                  header={
                    <div style={{ position: 'relative' }}>
                      <div className={styles.title}>{item.datasourceName}</div>
                      <p className={styles.subTitle}>url: {item.jdbcUrl}</p>
                      <div
                        className={styles.rightIcon}
                        onClick={event => {
                          event.stopPropagation();
                        }}
                      >
                        <Popover
                          placement="bottomRight"
                          content={
                            <div className={styles.actionWrap}>
                              <AddDataSourceModal
                                btnText="编辑"
                                action="edit"
                                businessActivityId={businessActivityId}
                                dataSourceId={item.datasourceId}
                                onSccuess={() => {
                                  queryMissingDataScriptList({
                                    businessActivityIds: [businessActivityId]
                                  });
                                }}
                              />

                              <CustomPopconfirm
                                okText="确认删除"
                                title={'是否确认删除数据源？'}
                                okColor="var(--FunctionalError-500, #ED6047)"
                                onConfirm={() =>
                                  handleDelete(
                                    businessActivityId,
                                    item.datasourceId
                                  )
                                }
                              >
                                <p>
                                  <Button type="link">删除</Button>
                                </p>
                              </CustomPopconfirm>
                            </div>}
                        >
                          <Icon
                            type="more"
                            onClick={event => {
                              event.stopPropagation();
                            }}
                          />
                        </Popover>
                      </div>
                    </div>}
                  key={k}
                >
                  <div>
                    <CustomTable
                      bordered={false}
                      defaultExpandAllRows={true}
                      columns={getMissingDataScriptColumns()}
                      dataSource={item.sqlResponseList}
                    />
                  </div>
                </Panel>
              );
            })}
        </Collapse>
      </div>
    </CommonModal>
  );
};
export default MissingDataScriptModal;
