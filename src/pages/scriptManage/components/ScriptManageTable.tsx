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
  Tooltip,
  Modal,
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import { customColumnProps } from 'src/components/custom-table/utils';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import { Link } from 'umi';
import AddTagsModal from '../modals/AddTagsModal';
import ScriptManageService from '../service';
import styles from './../index.less';

import request from 'src/utils/request';
import DebugScriptModal from '../modals/DebugScriptModal';
import DebugScriptRecordModal from '../modals/DebugScriptRecordModal';
import { getTakinAuthority } from 'src/utils/utils';

declare var serverUrl: string;
const getScriptManageColumns = (
  state,
  setState
): {
  columns: ColumnProps<any>[];
  stopDebug: (id?: number) => void;
} => {
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));
  const userType: string = localStorage.getItem('isAdmin');
  const expire: string = localStorage.getItem('troweb-expire');
  /**
   * @name  删除脚本
   */
  const handleDeleteScript = async (Id) => {
    const {
      data: { data, success },
    } = await ScriptManageService.deleteScript({
      scriptId: Id,
    });
    if (success) {
      message.success('删除成功');
      setState({
        isReload: !state.isReload,
      });
    }
  };

  /**
   * @name  下载打包脚本
   */
  const handleDownload = async (Id, fileName) => {
    const {
      data: { data, success },
    } = await ScriptManageService.downloadScript({
      scriptId: Id,
    });
    if (success) {
      downloadFile(data.content, `${fileName}.zip`);
    }
  };

  const downloadFile = async (filePath, fileName) => {
    const { data, status, headers } = await request({
      url: `${serverUrl}/file/downloadFileByPath?filePath=${filePath}`,
      responseType: 'blob',
      headers: {
        'x-token': localStorage.getItem('full-link-token'),
        'Auth-Cookie': localStorage.getItem('auth-cookie'),
        'tenant-code': localStorage.getItem('tenant-code'),
        'env-code': localStorage.getItem('env-code'),
      },
    });
    const blob = new Blob([data], { type: `` });

    // 获取heads中的filename文件名
    const downloadElement = document.createElement('a');
    // 创建下载的链接
    const href = window.URL.createObjectURL(blob);

    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    // 点击下载
    downloadElement.click();
    // 下载完成移除元素
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
  };

  /**
   * @name  下载单个脚本
   */
  const handleDownloadFile = async (Id, fileName) => {
    const { data, status, headers } = await request({
      url: `${serverUrl}/file/download?filePath=${Id}`,
      responseType: 'blob',
      headers: {
        'x-token': localStorage.getItem('full-link-token'),
        'Auth-Cookie': localStorage.getItem('auth-cookie'),
        'tenant-code': localStorage.getItem('tenant-code'),
        'env-code': localStorage.getItem('env-code'),
      },
    });
    const blob = new Blob([data], { type: `` });

    // 获取heads中的filename文件名
    const downloadElement = document.createElement('a');
    // 创建下载的链接
    const href = window.URL.createObjectURL(blob);

    downloadElement.href = href;
    // 下载后文件名
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    // 点击下载
    downloadElement.click();
    // 下载完成移除元素
    document.body.removeChild(downloadElement);
    // 释放掉blob对象
    window.URL.revokeObjectURL(href);
  };
  const stopDebug = (id = state.scriptRowId) => {
    Modal.confirm({
      title: '提示',
      content: '确认停止调试？',
      onOk: async () => {
        const {
          data: { success },
        } = await ScriptManageService.stopDebug({
          scriptDeployId: id,
        });
        if (success) {
          message.success('操作成功');
          setState({
            isReload: !state.isReload,
            isShowDebugModal: false,
            scriptDebugId: undefined,
            debugStatus: 0,
            errorInfo: null,
          });
        }
      },
    });
  };

  const columns = [
    {
      ...customColumnProps,
      title: '序号',
      dataIndex: 'scriptId',
    },
    {
      ...customColumnProps,
      title: '版本号id',
      dataIndex: 'id',
    },
    {
      ...customColumnProps,
      title: '脚本名称',
      dataIndex: 'scriptName',
      render: (text, row) => {
        return (
          <div className={styles.scriptName} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
            <Tooltip title={text} arrowPointAtCenter>
              <div style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {text}
              </div>
            </Tooltip>
            <span style={{ color: '#8C8C8C', marginLeft: 8, flex: 1, }}>
              版本{row.scriptVersion}
            </span>
          </div>
        );
      },
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
              <AddTagsModal
                tags={row.tag}
                scriptId={row.id}
                btnText={
                  <Icon
                    type="plus-circle"
                    style={{ color: 'var(--BrandPrimary-500)', marginLeft: 8 }}
                  />
                }
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload,
                  });
                }}
              />
            </AuthorityBtn>
          </div>
        );
      },
    },
    {
      ...customColumnProps,
      title: '关联业务',
      dataIndex: 'relatedBusiness',
      render: (text, row) => {
        return (
          <div style={{ display: 'flex', alignContent: 'center' }}>
            {row.type === '1' ? (
              <Tooltip title="业务活动">
                <img
                  style={{ width: 24, marginRight: 8 }}
                  src={require('./../../../assets/businessActivity.png')}
                />
              </Tooltip>
            ) : (
              <Tooltip title="业务流程">
                <img
                  style={{ width: 24, marginRight: 8 }}
                  src={require('./../../../assets/businessFlow.png')}
                />
              </Tooltip>
            )}
            <Tooltip title={text}>
              <span
                style={{
                  display: 'inline-block',
                  width: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {text}
              </span>
            </Tooltip>
          </div>
        );
      },
    },
    {
      ...customColumnProps,
      title: '相关文件',
      dataIndex: 'relatedFiles',
      render: (text, row) => {
        return text && text.length > 0 ? (
          <div>
            <Tag>
              <span
                style={{
                  display: 'inline-block',
                  width: 80,
                  lineHeight: '15px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {text[0] && text[0].fileName}
              </span>
            </Tag>
            <Popover
              placement="bottom"
              trigger="click"
              title="相关文件"
              content={
                <div className={styles.files}>
                  {text.map((item, k) => {
                    return (
                      <p key={k}>
                        {item && item.fileName}
                        <AuthorityBtn
                          isShow={
                            btnAuthority &&
                            btnAuthority.scriptManage_7_download &&
                            row.canDownload
                          }
                        >
                          <a
                            style={{ float: 'right', marginRight: 8 }}
                            onClick={() =>
                              handleDownloadFile(
                                item && item.downloadUrl,
                                item && item.fileName
                              )
                            }
                          >
                            下载
                          </a>
                        </AuthorityBtn>
                        <Divider />
                      </p>
                    );
                  })}
                </div>}
            >
              <Tag>...</Tag>
            </Popover>
          </div>
        ) : (
          '-'
        );
      },
    },
    {
      ...customColumnProps,
      title: '修改时间',
      dataIndex: 'updateTime',
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
      render: (text, row) => {
        return (
          <Fragment>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_3_update &&
                row.canEdit
              }
            >
              <Link
                style={{ marginRight: 8 }}
                to={`/scriptManage/scriptConfig?action=edit&id=${row.id}`}
              >
                编辑
              </Link>
            </AuthorityBtn>
            {row.canDebug === 1 ? (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.scriptManage_3_update &&
                  row.canEdit
                }
              >
                <span style={{ marginRight: 8 }}>
                  <DebugScriptModal
                    btnText="调试"
                    id={row.id}
                    state={state}
                    setState={setState}
                  />
                </span>
              </AuthorityBtn>
            ) : (
              <AuthorityBtn
                isShow={
                  btnAuthority &&
                  btnAuthority.scriptManage_3_update &&
                  row.canEdit
                }
              >
                <a style={{ marginRight: 8 }} onClick={() => stopDebug(row.id)}>
                  调试中
                </a>
              </AuthorityBtn>
            )}

            <DebugScriptRecordModal btnText="调试记录" id={row.id} />
            {userType === 'true' &&
              expire === 'false' &&
              getTakinAuthority() === 'true' && (
                <span style={{ marginRight: 8, marginLeft: 8 }}>
                  <AdminDistributeModal
                    dataId={row.id}
                    btnText="分配给"
                    menuCode="SCRIPT_MANAGE"
                    onSccuess={() => {
                      setState({
                        isReload: !state.isReload,
                      });
                    }}
                  />
                </span>
              )}

            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_7_download &&
                row.canDownload
              }
            >
              <Button
                style={{ marginRight: 8 }}
                type="link"
                onClick={() => handleDownload(row.id, row.scriptName)}
              >
                下载
              </Button>
            </AuthorityBtn>
            <AuthorityBtn
              isShow={
                btnAuthority &&
                btnAuthority.scriptManage_4_delete &&
                row.canRemove
              }
            >
              <Popconfirm
                title="确定删除脚本吗？"
                onConfirm={() => handleDeleteScript(row.id)}
              >
                <Button type="link" style={{ marginRight: 8 }}>
                  删除
                </Button>
              </Popconfirm>
            </AuthorityBtn>
            {!row.onlyOne && (
              <Button className="mg-l1x" type="link">
                <Link to={`/scriptManage/version?id=${row.scriptId}`}>
                  版本历史
                </Link>
              </Button>
            )}
          </Fragment>
        );
      },
    },
  ];

  return {
    columns,
    stopDebug,
  };
};

export default getScriptManageColumns;
