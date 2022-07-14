/**
 * @author chuxu
 */
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Icon,
  Menu,
  Modal,
  Row,
  Tooltip,
  Alert,
  message,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { connect } from 'dva';
import {
  CommonSelect,
  ImportFile,
  useCreateContext,
  useStateReducer,
} from 'racc';
import React, { Fragment, useEffect } from 'react';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import ImportFileModal from 'src/common/import-file-modal/ImportFileModal';
import CustomTable from 'src/components/custom-table';
import { customColumnProps } from 'src/components/custom-table/utils';
import { MainPageLayout } from 'src/components/page-layout';
import { Link, router } from 'umi';
import styles from './index.less';
import customStyles from './../../custom.less';
import AddJmeterModal from './modals/AddJmeterModal';
import BusicInfoModal from './modals/BasicInfoModal';
import DebugScriptModal from './modals/DebugScriptModal';
import DebugScriptRecordModal from './modals/DebugScriptRecordModal';
import MatchModal from './modals/MatchModal';
import ScriptFileManageModal from './modals/ScriptFileManageModal';
import BusinessFlowService from './service';
import { businessFlowStatusColorMap, businessFlowStatusMap } from './enum';
import useDragTable from 'src/components/useDragTable';
import { get, cloneDeep, set } from 'lodash';

interface Props {
  location?: any;
  dictionaryMap?: any;
}
const getInitState = () => ({
  threadGroupList: null, // 线程组列表
  threadValue: undefined, // 默认线程组
  treeData: null,
  threadDetail: {} as any,
  visible: false,
  detailData: {} as any,
  fileModalValues: {
    fileTitle: '业务活动匹配',
    status: 'loading',
    footerBtnTxt: '取消',
    footerTxt: '业务活动匹配中，请稍后',
    extraNode: null,
  },
  fileName: null,
  isReload: false,
  isShowDebugModal: false,
  scriptDebugId: undefined, // 脚本调试id
  debugStatus: 0, // 调试状态，0：未开始, 1：通过第二阶段， 2，3：通过第三阶段，4：通过第四阶段,
  errorInfo: null,
  tableDraggable: false,
  dragedTableSource: undefined,
  savingSort: false,
});
export const BusinessFlowDetailContext =
  useCreateContext<BusinessFlowDetailState>();
export type BusinessFlowDetailState = ReturnType<typeof getInitState>;
const BusinessFlowDetail: React.FC<Props> = (props) => {
  const [state, setState] = useStateReducer(getInitState());
  const { fileModalValues, detailData, threadDetail } = state;
  const { location, dictionaryMap } = props;
  const { query } = location;
  const { id, isAuto } = query;

  const { TableWarpper, tableProps, dataSourceHasPath, rowKeyMap } =
    useDragTable({
      dataSource: state.dragedTableSource || state.treeData,
      draggable: state.tableDraggable,
      rowKey: 'xpathMd5',
      updateDataSource: (data) =>
        setState({
          dragedTableSource: data,
        }),
    });

  useEffect(() => {
    if (isAuto === 'true') {
      queryMatchProcess();
    }
  }, [state.isReload]);

  useEffect(() => {
    if (id) {
      queryDetail();
    }
  }, [state.isReload]);

  useEffect(() => {
    if (state.threadValue && id) {
      queryTreeData();
    }
  }, [state.threadValue, state.isReload]);

  /**
   * @name 获取业务流程详情,获取线程组列表
   */
  const queryDetail = async () => {
    const {
      data: { success, data },
    } = await BusinessFlowService.queryDetail({ id });
    if (success) {
      setState({
        detailData: data,
        threadGroupList: data.scriptJmxNodeList,
        scriptDebugId: data.scriptDeployId,
        threadValue:
          state.threadValue ||
          (data.scriptJmxNodeList &&
            data.scriptJmxNodeList[0] &&
            data.scriptJmxNodeList[0].value),
      });
    }
  };

  /**
   * @name 获取线程组内容详情
   */
  const queryTreeData = async () => {
    const {
      data: { success, data },
    } = await BusinessFlowService.queryTreeData({
      id,
      xpathMd5: state.threadValue,
    });
    if (success) {
      setState({
        treeData: data.threadScriptJmxNodes,
        threadDetail: data,
      });
    }
  };

  /**
   * @name 获取匹配进度
   */
  const queryMatchProcess = async () => {
    setState({
      // visible: true,
      visible: false, // 不显示解析中的弹窗
      fileModalValues: {
        fileTitle: '业务活动匹配',
        status: 'loading',
        footerBtnTxt: '取消',
        footerTxt: '业务活动匹配中，请稍后',
        extraNode: null,
      },
      fileName: detailData.businessProcessName,
    });
    const {
      data: { success, data },
    } = await BusinessFlowService.queryMatchProcess({ id });
    if (success) {
      setState({
        fileName: data.businessProcessName,
        threadValue: undefined,
        fileModalValues: {
          fileTitle: '业务活动匹配',
          status: 'success',
          footerBtnTxt: '完成',
          footerTxt: `本次匹配完成，时间：${data.finishDate}`,
          extraNode: (
            <p>
              本次共自动匹配 <span>{data.matchNum}</span> 条API，剩
              <span> {data.unMatchNum} </span>条手动匹配
            </p>
          ),
        },
      });
      queryDetail();
    }
  };

  const handleChangeThread = (value) => {
    setState({
      threadValue: value,
      treeData: null,
    });
  };

  const removeTreeItem = (record) => {
    const _path = rowKeyMap[record.xpathMd5]?._path; // 示例：[0].children.[0]
    const _data = cloneDeep(dataSourceHasPath);
    const parentPath = _path.substring(0, _path.lastIndexOf('[') - 1);
    const itemIndex = _path.substring(
      _path.lastIndexOf('[') + 1,
      _path.length - 1
    );
    const parentArr = get(_data, parentPath);
    if (parentArr.length === 1) {
      message.warn('需要至少保留一条记录');
      return;
    }
    parentArr.splice(itemIndex, 1);

    set(_data, parentPath, parentArr);
    setState({
      dragedTableSource: _data,
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    const columns: ColumnProps<any>[] = [
      {
        ...customColumnProps,
        title: '调用树',
        dataIndex: 'testName',
        ellipsis: true,
        width: 300,
        render: (text) => {
          return (
            <span>
              <Tooltip placement="bottomLeft" title={text}>
                <span>{text}</span>
              </Tooltip>
            </span>
          );
        },
      },
      {
        ...customColumnProps,
        title: '入口应用',
        dataIndex: 'businessApplicationName',
        width: 150,
      },
      {
        ...customColumnProps,
        title: '入口',
        dataIndex: 'serviceName',
        width: 150,
        render: (text) => {
          return text ? (
            <Tooltip
              placement="bottomLeft"
              title={
                <div style={{ maxHeight: 300, overflow: 'auto' }}>{text}</div>}
            >
              <div
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {text}
              </div>
            </Tooltip>
          ) : (
            <span>-</span>
          );
        },
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'status',
        width: 100,
        render: (text, row) => {
          if (row.type === 'SAMPLER') {
            return (
              <Badge
                text={businessFlowStatusMap[text]}
                color={businessFlowStatusColorMap[text]}
              />
            );
          }
          return '-';
        },
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'startTime',
        width: 150,
        render: (text, row) => {
          if (row.type === 'SAMPLER') {
            return state.tableDraggable ? (
              <Button type="link" onClick={() => removeTreeItem(row)}>
                删除
              </Button>
            ) : (
              <MatchModal
                rowDetail={row}
                btnText="编辑匹配"
                apiName={row.testName}
                path={row.requestPath}
                isVirtual={String(row.businessType)}
                entranceApp={row.businessApplicationName}
                entrancePath={row.entrace}
                entrancePathWithoutZero={row.entracePath}
                samplerType={row.samplerType}
                onSuccess={() => {
                  setState({
                    isReload: !state.isReload,
                  });
                }}
                businessFlowId={id}
              />
            );
          }
          return '-';
        },
      },
    ];
    return columns;
  };

  const progressData = [
    {
      key: 1,
      imgSrc: 'debug_process_1',
      name: '应用配置校验',
    },
    {
      key: 2,
      imgSrc: 'debug_process_2',
      name: 'JMeter启动校验',
    },
    {
      key: 3,
      imgSrc: 'debug_process_3',
      name: '收集数据',
    },
    {
      key: 4,
      imgSrc: 'debug_process_4',
      name: '验证数据',
    },
  ];

  const saveSortData = async () => {
    if (!state.dragedTableSource) {
      message.warn('排序未发生变化');
      return;
    }
    setState({
      savingSort: true,
    });
    const {
      data: { success },
    } = await BusinessFlowService.saveFlowTreeSortData({
      id,
      xpathMd5: state.threadValue,
      threadScriptJmxNodes: state.dragedTableSource,
    }).finally(() => {
      setState({
        savingSort: false,
      });
    });
    if (success) {
      message.success('操作成功');
      setState({
        tableDraggable: false,
        dragedTableSource: undefined,
        isReload: !state.isReload,
      });
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <DebugScriptRecordModal
          btnText="调试历史"
          id={id}
          scriptDeployId={detailData.scriptDeployId}
        />
      </Menu.Item>
      <Menu.Item key="0">
        <BusicInfoModal
          id={id}
          btnText="基本信息"
          dictionaryMap={dictionaryMap}
          sceneName={detailData.businessProcessName}
          isCore={detailData.isCore}
          sceneLevel={detailData.sceneLevel}
          onSuccess={() => {
            setState({
              isReload: !state.isReload,
            });
          }}
        />
      </Menu.Item>
    </Menu>
  );

  return (
    <BusinessFlowDetailContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <Link to="/businessFlow">
          <Button type="link" style={{ marginBottom: 16 }}>
            <Icon type="left" /> 返回
          </Button>
        </Link>
        <div className={styles.borders}>
          <CustomDetailHeader
            title={
              detailData.businessProcessName &&
              detailData.businessProcessName.length > 30 ? (
                <Tooltip title={detailData.businessProcessName}>
                  {detailData.businessProcessName.substring(0, 30)}...
                </Tooltip>
              ) : (
                detailData.businessProcessName
              )
            }
            description={
              <p>
                <span className={customStyles.alertLabel}>线程总数：</span>
                <span className={customStyles.alertValueNormal}>
                  {detailData.threadGroupNum}
                </span>
                <span
                  className={customStyles.alertLabel}
                  style={{ marginLeft: 20 }}
                >
                  匹配进度：
                </span>
                <span
                  className={customStyles.alertValueNormal}
                  style={{ color: 'var(--FunctionalSuccess-500)' }}
                >
                  {detailData.linkRelateNum}
                </span>
                <span className={customStyles.alertValueNormal}> / </span>
                <span className={customStyles.alertValueNormal}>
                  {detailData.totalNodeNum}
                </span>
              </p>
            }
            img={
              <CustomIcon
                imgWidth={28}
                color="var(--BrandPrimary-500, #11D0C5)"
                imgName="redis_icon"
                iconWidth={64}
              />
            }
            extra={
              <div style={{ float: 'right' }}>
                <span style={{ marginRight: 8 }}>
                  <DebugScriptModal
                    btnText="调试"
                    id={id}
                    state={state}
                    setState={setState}
                    scriptDeployId={detailData.scriptDeployId}
                  />
                </span>
                <span style={{ marginRight: 8 }}>
                  <ScriptFileManageModal
                    onSuccess={() => {
                      setState({
                        isReload: !state.isReload,
                      });
                    }}
                    id={id}
                    btnText={`管理文件 ${
                      detailData.relatedFiles && detailData.relatedFiles.length
                    }`}
                    fileList={detailData.relatedFiles}
                  />
                </span>
                <span style={{ marginRight: 8 }}>
                  <AddJmeterModal
                    btnText="管理脚本"
                    action="edit"
                    fileList={detailData.scriptFile}
                    detailData={detailData}
                    id={detailData.id}
                    onSuccess={() => {
                      setTimeout(() => {
                        window.location.reload();
                      }, 1500);
                      setState({
                        isReload: !state.isReload,
                        threadValue: undefined,
                      });
                    }}
                  />
                </span>
                <Dropdown
                  trigger={['click']}
                  overlay={menu}
                  placement="bottomLeft"
                >
                  <Icon type="more" />
                </Dropdown>
              </div>}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <span style={{ marginRight: 8 }}>选择线程组:</span>
              <CommonSelect
                style={{ width: 280 }}
                dataSource={state.threadGroupList || []}
                value={state.threadValue}
                onChange={handleChangeThread}
                allowClear={false}
              />
            </Col>
            <span className={customStyles.alertLabel}>
              当前线程组匹配进度：
              <span className={customStyles.alertValueError}>
                {threadDetail.linkRelateNum}
              </span>
              <span className={customStyles.alertValueNormal}> / </span>
              <span className={customStyles.alertValueNormal}>
                {threadDetail.totalNodeNum}
              </span>
            </span>
          </Row>
          {state.treeData && (
            <>
              {state.tableDraggable ? (
                <Alert
                  banner
                  showIcon={false}
                  style={{ marginTop: 8, textAlign: 'center' }}
                  message={
                    <div>
                      <Button
                        type="link"
                        style={{ marginRight: 8 }}
                        onClick={saveSortData}
                      >
                        保存排序
                      </Button>
                      <Button
                        type="link"
                        style={{ color: '#999' }}
                        loading={state.savingSort}
                        onClick={() => {
                          setState({
                            tableDraggable: false,
                            dragedTableSource: undefined,
                          });
                          queryTreeData();
                        }}
                      >
                        取消排序
                      </Button>
                    </div>
                  }
                  type="warning"
                />
              ) : (
                <div style={{ textAlign: 'right' }}>
                  <Button
                    onClick={() => {
                      setState({ tableDraggable: true });
                    }}
                  >
                    排序
                  </Button>
                </div>
              )}
              <TableWarpper>
                <CustomTable
                  rowKey="xpathMd5"
                  columns={getColumns()}
                  size="small"
                  dataSource={state.dragedTableSource || state.treeData}
                  defaultExpandAllRows={true}
                  childrenColumnName="children"
                  {...tableProps}
                />
              </TableWarpper>
            </>
          )}
        </div>
        <ImportFileModal
          zIndex={10000000}
          onCancel={() => {
            queryDetail();
            setState({
              fileModalValues: {
                fileTitle: null,
                status: 'loading',
                footerTxt: null,
                extraNode: null,
                footerBtnTxt: null,
              },
              visible: false,
            });
          }}
          fileName={state.fileName}
          fileTitle={fileModalValues.fileTitle}
          visible={state.visible}
          extraNode={fileModalValues.extraNode}
          status={fileModalValues.status}
          footerTxt={fileModalValues.footerTxt}
          footerBtnTxt={fileModalValues.footerBtnTxt}
          onBtnClick={() => {
            queryDetail();
            setState({
              visible: false,
              fileModalValues: {
                fileTitle: null,
                status: null,
                footerTxt: null,
                extraNode: null,
                footerBtnTxt: null,
              },
            });
            router.push(`/businessFlow/details?id=${id}`);
            window.history.go(0);
          }}
        />
        <Modal
          width={710}
          title={`${
            (!state.scriptDebugId && state.debugStatus !== 0) ||
            state.debugStatus === 5
              ? '调试异常'
              : '调试'
          }`}
          footer={null}
          visible={state.isShowDebugModal}
          closable={
            (!state.scriptDebugId && state.debugStatus !== 0) ||
            state.debugStatus === 5
              ? true
              : false
          }
          maskClosable={false}
          onCancel={() => {
            setState({
              isShowDebugModal: false,
              scriptDebugId: undefined,
              debugStatus: 0,
              errorInfo: null,
            });
          }}
        >
          {(!state.scriptDebugId && state.debugStatus !== 0) ||
          state.debugStatus === 5 ? (
            <div style={{ height: 400, overflow: 'auto' }}>
              {state.errorInfo &&
                state.errorInfo.map((item, k) => {
                  return (
                    <p key={k} style={{ fontSize: 16 }}>
                      {k + 1}、{item}
                    </p>
                  );
                })}
            </div>
          ) : (
            <Row type="flex" style={{ padding: '50px 10px' }}>
              {progressData.map((item, k) => {
                return (
                  <Fragment key={k}>
                    <Col>
                      <div
                        className={styles.progressCircle}
                        style={{
                          borderColor:
                            (state.debugStatus <= 2 &&
                              k <= state.debugStatus) ||
                            (state.debugStatus === 3 &&
                              k + 1 <= state.debugStatus) ||
                            state.debugStatus === 4
                              ? '#28C6D7'
                              : '#D9D9D9',
                        }}
                      >
                        <img
                          style={{ width: 36 }}
                          src={require(`./../../assets/${item.imgSrc}${
                            (state.debugStatus <= 2 &&
                              k <= state.debugStatus) ||
                            (state.debugStatus === 3 &&
                              k + 1 <= state.debugStatus) ||
                            state.debugStatus === 4
                              ? '_active'
                              : ''
                          }.png`)}
                        />
                      </div>
                      <p className={styles.progressName}>{item.name}</p>
                    </Col>
                    {k !== progressData.length - 1 && (
                      <Col style={{ margin: '0px 5px' }}>
                        <div
                          className={styles.dashedLine}
                          style={{
                            borderColor:
                              k <= state.debugStatus ? '#28C6D7' : '#D9D9D9',
                          }}
                        />
                      </Col>
                    )}
                  </Fragment>
                );
              })}
            </Row>
          )}
        </Modal>
      </MainPageLayout>
    </BusinessFlowDetailContext.Provider>
  );
};
export default connect(({ common }) => ({ ...common }))(BusinessFlowDetail);
