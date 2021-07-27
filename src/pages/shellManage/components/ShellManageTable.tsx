/**
 * @name
 * @author chuxu
 */
import {
  Button,
  Divider,
  Icon,
  message,
  Popconfirm,
  Popover,
  Tag,
  Tooltip
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { customColumnProps } from 'src/components/custom-table/utils';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { Link } from 'umi';
import AddShellTagsModal from '../modals/AddShellTagsModal';
import ShellResultListModal from '../modals/ShellResultListModal';
import ShellManageService from '../service';
import styles from './../index.less';

const getScriptManageColumns = (state, setState): ColumnProps<any>[] => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');
  /**
   * @name  删除脚本
   */
  const handleDeleteScript = async Id => {
    const {
      data: { data, success }
    } = await ShellManageService.deleteShellScript({
      scriptId: Id
    });
    if (success) {
      message.success('删除成功');
      setState({
        isReload: !state.isReload
      });
    }
  };

  /**
   * @name 执行脚本
   */
  const handleStartScript = async value => {
    setState({
      showModal: true,
      loading: true,
      scriptDeployId: value
    });
    const {
      data: { data, success }
    } = await ShellManageService.startShellScript({
      scriptDeployId: value
    });
    if (success) {
      queryScriptResult(value);
      return;
    }
    setState({
      loading: false
    });
  };

  /**
   * @name 执行脚本
   */
  const handleClickScript = async value => {
    setState({
      showModal: true,
      scriptDeployId: value
    });
  };

  /**
   * @name 查询执行脚本过程
   */
  const queryScriptResult = async value => {
    const {
      data: { data, success }
    } = await ShellManageService.queryShellResultList({
      scriptDeployId: value,
      type: 0
    });
    if (success) {
      if (data && data.length > 0 && data[0] && data[0].isStop === true) {
        setState({
          executeResult: data[0].result,
          loading: false,
          resultStatus: data[0].success
        });
        return;
      }
      setState({
        loading: true
      });

      // setTimeout(() => {
      //   queryScriptResult(value);
      // }, 1000);
    }
  };

  return [
    {
      ...customColumnProps,
      title: '序号',
      dataIndex: 'scripDeployId'
    },
    {
      ...customColumnProps,
      title: '脚本名称',
      dataIndex: 'scriptName'
    },
    {
      ...customColumnProps,
      title: '标签',
      dataIndex: 'tag',
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
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_3_update &&
                row.canEdit
              }
            >
              <AddShellTagsModal
                tags={row.tag}
                scriptId={row.scripDeployId}
                btnText={
                  <Icon
                    type="plus-circle"
                    style={{ color: '#11BBD5', marginLeft: 8 }}
                  />
                }
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            </AuthorityBtn>
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '版本',
      dataIndex: 'scriptVersion',
      render: text => {
        return <span>版本{text}</span>;
      }
    },
    {
      ...customColumnProps,
      title: '脚本描述',
      dataIndex: 'description',
      width: 200
    },
    {
      ...customColumnProps,
      title: '修改时间',
      dataIndex: 'updateTime'
    },
    {
      ...customColumnProps,
      title: '负责人',
      dataIndex: 'managerName'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        return (
          <Fragment>
            {/* <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_3_update &&
                row.canEdit
              }
            > */}
            {row.execute === false && (
              <Link
                style={{ marginRight: 8 }}
                to={`/shellManage/shellConfig?action=edit&id=${row.scriptId}&scriptDeployId=${row.scripDeployId}`}
              >
                编辑
              </Link>
            )}

            {/* </AuthorityBtn> */}
            {/* <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_4_delete &&
                row.canRemove
              }
            > */}
            {row.execute === false && (
              <Popconfirm
                title="确定删除脚本吗？"
                onConfirm={() => handleDeleteScript(row.scriptId)}
              >
                <Button type="link" style={{ marginRight: 8 }}>
                  删除
                </Button>
              </Popconfirm>
            )}

            {/* </AuthorityBtn> */}
            {row.execute === false ? (
              <Popconfirm
                title="确定运行脚本吗？脚本运行后操作不可逆，不可终止，不可恢复"
                onConfirm={() => handleStartScript(row.scripDeployId)}
              >
                <a style={{ marginRight: 8 }}>运行</a>
              </Popconfirm>
            ) : (
              <a
                style={{ marginRight: 8 }}
                onClick={() => handleClickScript(row.scripDeployId)}
              >
                运行中
              </a>
            )}

            <ShellResultListModal
              btnText="执行结果"
              scriptDeployId={row.scripDeployId}
            />
          </Fragment>
        );
      }
    }
  ];
};

export default getScriptManageColumns;
