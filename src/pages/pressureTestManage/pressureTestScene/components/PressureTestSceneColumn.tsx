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
  Popover
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

const getPressureTestSceneColumns = (state, setState): ColumnProps<any>[] => {
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
  const handleDelete = async id => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.deletePressureTestScene({ id });
    if (success) {
      message.success('删除压测场景成功！');
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name 开启压测
   */
  const handleStart = async (sceneId, reportId) => {
    setState({
      startStatus: 'loading'
    });
    const {
      data: { data, success }
    } = await PressureTestSceneService.checkStartStatus({ sceneId, reportId });
    if (success && data.data !== 0) {
      if (data.data === 2) {
        setState({
          startStatus: 'success'
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
        startErrorList: data.msg
      });
    }
  };

  /**
   * @name 停止压测
   */
  const handleStop = async sceneId => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.stopPressureTestScene({ sceneId });
    if (success) {
      message.success('停止压测场景成功！');
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name 是否有数据验证
   */
  const queryHasMissingDataScript = async sceneId => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.queryHasMissingDataScript({ sceneId });
    if (success) {
      setState({
        sceneId,
        missingDataStatus: true,
        hasMissingData: data
      });
    }
  };

  /**
   * @name 是否位点已经发生偏移
   */
  const queryDataScriptNum = async sceneId => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.queryDataScriptNum({ id: sceneId });
    if (success) {
      setState({
        dataScriptNum: data
      });
    }
  };

  const handleClickStart = async sceneId => {
    queryHasMissingDataScript(sceneId);
    queryDataScriptNum(sceneId);
  };

  const handleCloseTiming = async (sceneId: number) => {
    const {
      data: { data, success }
    } = await PressureTestSceneService.closeTiming({ sceneId });
    if (success) {
      message.info('成功关闭定时');
      setState({
        isReload: !state.isReload
      });
    }
  };

  return [
    {
      ...customColumnProps,
      title: 'ID',
      dataIndex: 'id'
    },
    {
      ...customColumnProps,
      title: '压测场景名称',
      dataIndex: 'sceneName'
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
                  isReload: !state.isReload
                });
              }}
            />
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '状态',
      dataIndex: 'status',
      render: text => {
        return (
          <Badge
            text={text === 0 ? '待启动' : text === 1 ? '启动中' : '压测中'}
            color={text === 2 ? 'var(--BrandPrimary-500)' : 'var(--Netural-06)'}
          />
        );
      }
    },
    {
      ...customColumnProps,
      title: '最新压测时间 / 定时压测时间',
      dataIndex: 'lastPtTime',
      render: (text, row) =>
        text ? (
          row.isScheduler ? (
            <Fragment>
              <div>{text}</div>
              {row.scheduleExecuteTime && (
                <div style={{ color: '#bababa' }}>
                  {row.scheduleExecuteTime}(定时)
                </div>
              )}
            </Fragment>
          ) : (
            text
          )
        ) : (
          '--'
        )
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: 'userName',
      className: getTakinAuthority() === 'true' ? '' : 'tableHiddle'
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
                  to={`/pressureTestManage/pressureTestScene/pressureTestSceneConfig?action=edit&id=${row.id}`}
                >
                  编辑
                </Link>
              </AuthorityBtn>
            )}
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
              <Button disabled type="link" style={{ marginRight: 8 }}>
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
                to={`/pressureTestManage/pressureTestReport?sceneName=${row.sceneName}`}
              >
                查看报告
              </Link>
            )}
            {userType &&
              expire === 'false' &&
              getTakinAuthority() === 'true' && (
                <span style={{ marginRight: 8 }}>
                  <AdminDistributeModal
                    dataId={row.id}
                    btnText="分配给"
                    menuCode="SCENE_MANAGE"
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload
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
                  okText="确认删除"
                  title={'是否确认删除'}
                  okColor="var(--FunctionalError-500)"
                  onConfirm={() => handleDelete(row.id)}
                >
                  <Button type="link" style={{ marginRight: 8 }}>
                    删除
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
      }
    }
  ];
};

export default getPressureTestSceneColumns;
