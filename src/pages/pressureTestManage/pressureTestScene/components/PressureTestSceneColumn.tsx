/**
 * @name
 * @author chuxu
 */
import {
  Badge,
  Button,
  Divider,
  Icon,
  message,
  Popconfirm,
  Popover,
  Modal,
  Progress,
  Tooltip,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomPopconfirm from 'src/components/custom-popconfirm/CustomPopconfirm';
import { customColumnProps } from 'src/components/custom-table/utils';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { getTakinAuthority } from 'src/utils/utils';
import Link from 'umi/link';
import router from 'umi/router';
import styles from '../../../scriptManage/index.less';
import { PressureTestSceneEnum } from '../enum';
import AddTagsModal from '../modals/AddTagsModal';
import PressureTestSceneService from '../service';

const getPressureTestSceneColumns = (
  state,
  setState,
  dictionaryMap
): {
  columns: ColumnProps<any>[];
  cancelLaunch: (id?: number) => void;
} => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const menuAuthority: any =
    localStorage.getItem('trowebUserResource') &&
    JSON.parse(localStorage.getItem('trowebUserResource'));

  const userType: string = localStorage.getItem('isAdmin');
  const expire: string = localStorage.getItem('troweb-expire');

  /**
   * @name 删除压测场景
   */
  const handleDelete = async (id) => {
    const {
      data: { data, success },
    } = await PressureTestSceneService.deletePressureTestScene({ id });
    if (success) {
      message.success('操作成功！');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  /**
   * @name 开启压测
   */
  const handleStart = async (sceneId, reportId) => {
    setState({
      startStatus: 'loading',
    });
    const {
      data: { data, success },
    } = await PressureTestSceneService.checkStartStatus({ sceneId, reportId });
    if (success && data.data !== 0) {
      if (data.data === 2) {
        setState({
          startStatus: 'success',
        });
        const startTime: any = new Date().getTime();
        localStorage.setItem('startTime', startTime);
        message.success('开启压测场景成功！');
        router.push(
          `/pressureTestManage/pressureTestReport/pressureTestLive?id=${sceneId}`
        );
      } else if (data.data === 1) {
        setTimeout(() => {
          handleStart(sceneId, reportId);
        }, 500);
      }
    } else {
      setState({
        startStatus: 'fail',
        startErrorList: data.msg,
      });
    }
  };

  /**
   * @name 停止压测
   */
  const handleStop = async (sceneId) => {
    const {
      data: { data, success },
    } = await PressureTestSceneService.stopPressureTestScene({ sceneId });
    if (success) {
      message.success('停止压测场景成功！');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  /**
   * @name 是否有数据验证
   */
  const queryHasMissingDataScript = async (sceneId) => {
    const {
      data: { data, success },
    } = await PressureTestSceneService.queryHasMissingDataScript({ sceneId });
    if (success) {
      setState({
        sceneId,
        missingDataStatus: true,
        hasMissingData: data,
      });
    }
  };

  /**
   * @name 是否位点已经发生偏移
   */
  const queryDataScriptNum = async (sceneId) => {
    const {
      data: { data, success },
    } = await PressureTestSceneService.queryDataScriptNum({ id: sceneId });
    if (success) {
      setState({
        dataScriptNum: data,
      });
    }
  };

  const handleClickStart = async (sceneId) => {
    queryHasMissingDataScript(sceneId);
    queryDataScriptNum(sceneId);
  };

  const handleCloseTiming = async (sceneId: number) => {
    const {
      data: { data, success },
    } = await PressureTestSceneService.closeTiming({ sceneId });
    if (success) {
      message.info('成功关闭定时');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  const cancelLaunch = (id) => {
    Modal.confirm({
      title: '提示',
      content: '确认停止启动？',
      onOk: async () => {
        const {
          data: { success },
        } = await PressureTestSceneService.scencePreStop({
          sceneId: id,
        });
        if (success) {
          message.success('操作成功');
          setState({
            isReload: !state.isReload,
            visible: false,
          });
        }
      },
    });
  };

  const copySence = async (row) => {
    const {
      data: { success },
    } = await PressureTestSceneService.copySence({
      id: row.id,
    });
    if (success) {
      message.success('操作成功');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  const shareSence = async (row) => {
    const {
      data: { success },
    } = await PressureTestSceneService.shareSence({
      sceneManageId: row.id,
    });
    if (success) {
      message.success('操作成功');
      setState({
        isReload: !state.isReload,
      });
    }
  };
  const cancelShareSence = async (row) => {
    const {
      data: { success },
    } = await PressureTestSceneService.cancelShareSence({
      sceneManageId: row.id,
    });
    if (success) {
      message.success('操作成功');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  const columns = [
    {
      ...customColumnProps,
      title: 'ID',
      dataIndex: 'id',
    },
    {
      ...customColumnProps,
      title: '压测场景名称',
      dataIndex: 'sceneName',
    },
    {
      ...customColumnProps,
      title: '标签',
      dataIndex: PressureTestSceneEnum.标签,
      render: (text, row) => {
        return (
          <div className={styles.tagsWrap}>
            {text && text.length > 1 ? (
              <span>
                <span className={styles.circleTag}>
                  {text[0] && text[0].tagName}
                </span>
                <Popover
                  placement="bottom"
                  trigger="click"
                  title="标签"
                  content={
                    <div className={styles.tags}>
                      {text.map((item, k) => {
                        return (
                          <p key={k}>
                            {item.tagName} <Divider />
                          </p>
                        );
                      })}
                    </div>}
                >
                  <a className={styles.circleTag} style={{ marginLeft: 8 }}>
                    ...
                  </a>
                </Popover>
              </span>
            ) : text && text.length === 1 ? (
              <a className={styles.circleTag} style={{ marginLeft: 8 }}>
                {text[0] && text[0].tagName}
              </a>
            ) : (
              <span> - </span>
            )}
            <AddTagsModal
              tags={row.tag}
              sceneId={row.id}
              btnText={
                <Icon
                  type="plus-circle"
                  style={{ color: 'var(--BrandPrimary-500)', marginLeft: 8 }}
                />
              }
              onSccuess={() => {
                setState({
                  isReload: !state.isReload,
                  tagReloadKey: state.tagReloadKey + 1,
                });
              }}
            />
          </div>
        );
      },
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => {
        return (
          <Badge
            status={text === 2 ? 'processing' : 'default'}
            text={
              {
                '-1': '已归档',
                0: '待启动',
                1: '启动中',
                2: (
                  <span>
                    压测中
                    <Tooltip title={`进度${record.progress || 0}%`}>
                      <Progress
                        type="circle"
                        width={14}
                        percent={record.progress || 0}
                        strokeWidth={20}
                        style={{ marginLeft: 4, cursor: 'pointer' }}
                        showInfo={false}
                      />
                    </Tooltip>
                  </span>
                ),
              }[text] || '待启动'
            }
            color={text === 2 ? 'var(--BrandPrimary-500)' : 'var(--Netural-06)'}
          />
        );
      },
    },
    {
      ...customColumnProps,
      title: '最新压测时间',
      dataIndex: 'lastPtTime',
      render: (text, row) => (
        <Fragment>
          <div>{text || '-'}</div>
          {row.isScheduler && row.scheduleExecuteTime && (
            <div style={{ color: '#bababa' }}>
              {row.scheduleExecuteTime}(定时)
            </div>
          )}
        </Fragment>
      ),
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: 'userName',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle',
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      align: 'right',
      render: (text, row) => {
        return (
          <Fragment>
            {row.isScheduler && (
              <Popconfirm
                onConfirm={() => handleCloseTiming(row.id)}
                title="是否关闭定时启动?"
              >
                <Button className="mg-r1x" type="link">
                  关闭定时
                </Button>
              </Popconfirm>
            )}
            {row.status === 0 && (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.pressureTestManage_pressureTestScene_3_update &&
                  row.canEdit
                }
              >
                <Link
                  style={{ marginRight: 8 }}
                  to={
                    row.hasAnalysisResult
                      ? `/pressureTestManage/pressureTestSceneV2/edit?id=${row.id}`
                      : `/pressureTestManage/pressureTestScene/pressureTestSceneConfig?action=edit&id=${row.id}`
                  }
                >
                  编辑
                </Link>
              </AuthorityBtn>
            )}
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.pressureTestManage_pressureTestScene_3_update &&
                row.canEdit
              }
            >
              <CustomPopconfirm
                arrowPointAtCenter
                title="确定复制该场景？"
                onConfirm={() => copySence(row)}
              >
                <a style={{ marginRight: 8 }}>复制</a>
              </CustomPopconfirm>
              {row.hasGlobalScene ? <CustomPopconfirm
                arrowPointAtCenter
                title="确定取消分享该场景？"
                onConfirm={() => cancelShareSence(row)}
              >
                <a style={{ marginRight: 8 }}>取消共享</a>
              </CustomPopconfirm> :
              <CustomPopconfirm
                arrowPointAtCenter
                title="确定分享该场景？"
                onConfirm={() => shareSence(row)}
              >
                <a style={{ marginRight: 8 }}>设为共享</a>
              </CustomPopconfirm>}
            </AuthorityBtn>
            {row.status === 0 && (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.pressureTestManage_pressureTestScene_5_start_stop &&
                  row.canStartStop
                }
              >
                <Button
                  onClick={() => {
                    handleClickStart(row.id);
                  }}
                  type="link"
                  style={{ marginRight: 8 }}
                >
                  启动
                </Button>
              </AuthorityBtn>
            )}
            {row.status === 1 && (
              <Button
                type="link"
                style={{ marginRight: 8 }}
                onClick={() => cancelLaunch(row.id)}
              >
                启动中
              </Button>
            )}
            {(getTakinAuthority() === 'false' ||
              (row.hasReport &&
                row.status !== 2 &&
                btnAuthority.pressureTestManage_pressureTestScene_5_start_stop &&
                menuAuthority &&
                menuAuthority.pressureTestManage_pressureTestReport)) && (
              <Link
                style={{ marginRight: 8 }}
                to={`/pressureTestManage/pressureTestReport?sceneId=${row.id}`}
              >
                查看报告
              </Link>
            )}
            {userType === 'true' &&
              expire === 'false' &&
              getTakinAuthority() === 'true' && (
                <span style={{ marginRight: 8 }}>
                  <AdminDistributeModal
                    dataId={row.id}
                    btnText="分配给"
                    menuCode="SCENE_MANAGE"
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload,
                      });
                    }}
                  />
                </span>
              )}
            {row.status === 0 && (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.pressureTestManage_pressureTestScene_4_delete &&
                  row.canRemove
                }
              >
                <CustomPopconfirm
                  arrowPointAtCenter
                  placement="topRight"
                  okText="确认归档"
                  title={'归档后该压测场景将被移动到回收站'}
                  okColor="var(--FunctionalError-500)"
                  onConfirm={() => handleDelete(row.id)}
                >
                  <Button type="link" style={{ marginRight: 8 }}>
                    归档
                  </Button>
                </CustomPopconfirm>
              </AuthorityBtn>
            )}
            {row.status === 2 && (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.pressureTestManage_pressureTestScene_5_start_stop &&
                  row.canStartStop
                }
              >
                <CustomPopconfirm
                  okText="确认停止"
                  title={'是否确认停止'}
                  okColor="var(--FunctionalError-500)"
                  onConfirm={() => handleStop(row.id)}
                >
                  <Button type="link" style={{ marginRight: 8 }}>
                    停止
                  </Button>
                </CustomPopconfirm>
              </AuthorityBtn>
            )}
            {row.status === 2 && (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.pressureTestManage_pressureTestScene_5_start_stop &&
                  row.canStartStop
                }
              >
                <Link
                  to={`/pressureTestManage/pressureTestReport/pressureTestLive?id=${row.id}`}
                >
                  压测实况
                </Link>
              </AuthorityBtn>
            )}
          </Fragment>
        );
      },
    },
  ];

  return {
    columns,
    cancelLaunch,
  };
};

export default getPressureTestSceneColumns;
