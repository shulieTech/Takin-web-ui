/**
 * @name
 * @author chuxu
 */
import { Button, Menu, Dropdown, message, Icon, Modal, Tag, Spin } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Fragment } from 'react';
import { customColumnProps } from 'src/components/custom-table/utils';
import AdminDistributeModal from 'src/modals/AdminDistributeModal';
import EditCodeModal from '../modals/EditCodeModal';
import ScriptManageService from '../service';
import ScriptModal from '../modals/ScriptModal';
import styles from './../index.less';
import { getTakinAuthority } from 'src/utils/utils';

const { confirm } = Modal;

const getScriptManageColumns = (state, setState): ColumnProps<any>[] => {
  const userType: string = localStorage.getItem('troweb-role');
  const expire: string = localStorage.getItem('troweb-expire');
  const showConfirm = row => {
    confirm({
      title: '脚本执行',
      content: '是否确认执行脚本？',
      okText: '确认执行',
      icon: (
        <span className={styles.fontSize}>
          <Icon
            type="exclamation-circle"
            theme="filled"
            style={{ color: '#11D0C5' }}
          />
        </span>
      ),
      onOk() {
        startImplement(row);
      }
    });
  };

  const showDelete = id => {
    confirm({
      title: '删除脚本',
      content: '是否确认删除？',
      okType: 'danger',
      okText: '确认删除',
      icon: (
        <span className={styles.fontSize}>
          <Icon type="warning" theme="filled" style={{ color: '#ED6047' }} />
        </span>
      ),
      onOk() {
        handleDeleteScript(id);
      }
    });
  };

  const handleDeleteScript = async id => {
    const {
      data: { success }
    } = await ScriptManageService.deleteScript({ id });
    if (success) {
      message.success('删除成功');
      setState({ isReload: !state.isReload });
      return;
    }
  };

  const startImplement = async row => {
    const id = row.id;
    const {
      data: { success }
    } = await ScriptManageService.resetVersion({ id });
    if (success) {
      message.success('执行成功');
      distribution(id);
      setState({ row, isReload: !state.isReload, visible: true });
      return;
    }
  };

  const distribution = async id => {
    let timer3;
    clearTimeout(timer3);
    const {
      data: { success, data }
    } = await ScriptManageService.startDebug({ id });
    if (success) {
      if (data.end === false) {
        timer3 = setTimeout(() => distribution(id), 5000);
        setState({ timer3, code: data.content });
      } else {
        setState({
          code: data.content,
          scroll: {
            x: 0,
            y: 10000000000000000
          }
        });
      }
    }
  };

  const menu = row => {
    return (
      <Menu>
        {userType === '0' &&
          expire === 'false' &&
          getTakinAuthority() === 'true' && (
            <Menu.Item>
              <AdminDistributeModal
                dataId={row.id}
                btnText="分配"
                menuCode="OPS_SCRIPT_MANAGE"
                onSccuess={() => {
                  setState({
                    isReload: !state.isReload
                  });
                }}
              />
            </Menu.Item>
          )}
        {row.canRemove && (
          <Menu.Item>
            <Button
              type="link"
              style={{ marginRight: 8 }}
              onClick={() => showDelete(row.id)}
            >
              删除
            </Button>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  return [
    {
      ...customColumnProps,
      title: '序号',
      dataIndex: 'id',
      width: 100
    },
    {
      ...customColumnProps,
      title: '脚本',
      dataIndex: 'name',
      render: (text, row) => {
        return (
          <div style={{ fontSize: '16px', marginTop: 6 }}>
            {text}
            {getTakinAuthority() === 'true' && (
              <div style={{ color: '#8C8C8C', margin: '6px 0' }}>
                负责人：<span style={{ color: '#000' }}>{row.userName}</span>
              </div>
            )}
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '类型',
      dataIndex: 'scriptType',
      render: (text, row) => {
        return (
          <Tag>
            {
              {
                1: '影子库表创建脚本',
                2: '基础数据准备脚本',
                3: '铺底数据脚本',
                4: '影子库表清理脚本',
                5: '缓存预热脚本'
              }[text]
            }
          </Tag>
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后执行时间',
      dataIndex: 'lastExecuteTime',
      render: (text, row) => {
        return (
          <div>
            <span style={{ marginRight: 10, display: 'inline-block' }}>
              {text}
            </span>
            {row.statusName === '执行中' ? (
              <div>
                <Spin size="small" />
                <span style={{ marginRight: 10 }} />
                执行中...
                <span style={{ marginRight: 10 }} />
                <EditCodeModal
                  state={state}
                  setState={setState}
                  btnText="查看实况"
                  fileId={row.id}
                  name={row.name}
                  type={row.scriptType}
                />
              </div>
            ) : row.statusName === '执行结束' ? (
              <EditCodeModal
                state={state}
                setState={setState}
                btnText="查看结果"
                fileId={row.id}
                name={row.name}
                type={row.scriptType}
              />
            ) : (
              '--'
            )}
          </div>
        );
      }
    },
    {
      ...customColumnProps,
      title: '最后更新时间',
      dataIndex: 'lastModefyTime'
    },
    {
      ...customColumnProps,
      title: '操作',
      dataIndex: 'action',
      render: (text, row) => {
        if (row.statusName === '执行中') {
          return (
            <Fragment>
              <div>
                <span
                  style={{
                    color: '#BABABA',
                    display: row.canStartStop ? 'inline-block' : 'none'
                  }}
                >
                  执行
                </span>
                <span style={{ marginLeft: 15 }} />
                <span
                  style={{
                    color: '#BABABA',
                    display: row.canEdit ? 'inline-block' : 'none'
                  }}
                >
                  编辑
                </span>
                <span style={{ marginLeft: 15 }} />
                <span
                  style={{
                    transform: 'rotate(90deg)',
                    display: 'inline-block',
                    color: '#BABABA'
                  }}
                >
                  ...
                </span>
              </div>
            </Fragment>
          );
        }
        return (
          <Fragment>
            <div>
              {row.canStartStop && (
                <Button type="link" onClick={() => showConfirm(row)}>
                  执行
                </Button>
              )}
              <span style={{ marginLeft: 15 }} />
              {row.canEdit && (
                <ScriptModal
                  btnText="编辑"
                  type="link"
                  state={state}
                  setState={setState}
                  id={row.id}
                />
              )}
              <span style={{ marginLeft: 15 }} />
              <Dropdown overlay={menu(row)} trigger={['click']}>
                <a
                  style={{
                    transform: 'rotate(90deg)',
                    display: 'inline-block'
                  }}
                  onClick={e => e.preventDefault()}
                >
                  ...
                </a>
              </Dropdown>
            </div>
          </Fragment>
        );
      }
    }
  ];
};

export default getScriptManageColumns;
