/**
 * @name
 * @author chuxu
 */
import React, { Fragment } from 'react';
import {
  Popconfirm,
  Switch,
  Tooltip,
  message,
  Button,
  Dropdown,
  Menu,
  Icon
} from 'antd';

import styles from './../index.less';
import DetailHeader from 'src/common/detail-header';
import AppManageService from '../service';
import copy from 'copy-to-clipboard';
import AddAppDrawer from './AddAppDrawer';
import router from 'umi/router';
import { appConfigStatusMap, appConfigStatusColorMap } from '../enum';
import { openNotification } from 'src/common/custom-notification/CustomNotification';
import AppErrorListModal from '../modals/AppErrorListModal';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import ImportFileModal from '../modals/ImportFileModal';
interface Props {
  id?: string | number;
  detailData?: any;
  state?: any;
  setState?: (value) => void;
  action?: string;
}

declare var serverUrl: string;
const AppDetailHeader: React.FC<Props> = props => {
  const { detailData, state, setState, id } = props;
  const btnAuthority: any =
    localStorage.getItem('trowebBtnResource') &&
    JSON.parse(localStorage.getItem('trowebBtnResource'));

  /**
   * @name 复制异常
   */
  const handleCopy = async value => {
    if (copy(value)) {
      message.success('复制成功');
    } else {
      message.error('复制失败');
    }
  };

  /**
   * @name  删除应用
   */
  const handleDeleteApp = async Id => {
    const {
      data: { data, success }
    } = await AppManageService.deleteApp({
      id: Id
    });
    if (success) {
      openNotification('删除应用成功', '');
      router.push('/appManage');
    }
  };

  /**
   * @name  刷新应用状态
   */
  const handleRefresh = async Id => {
    const {
      data: { data, success }
    } = await AppManageService.refreshAppStatus({});
    if (success) {
      setState({
        detailData: {
          ...detailData,
          accessStatus: 2
        }
      });
    }
  };

  const handleExport = async () => {
    const {
      data: { data, success }
    } = await AppManageService.exportAppConfig({
      id
    });
    if (success) {
      message.success('导出成功');
      location.href = `${serverUrl}${data}`;
    }
  };

  const leftData = {
    label: '应用名称',
    value: detailData && detailData.applicationName,
    isTooltip: true
  };
  const rightData = [
    { label: '最后修改时间', value: detailData && detailData.updateTime },
    {
      label: '应用状态',
      value: (
        <Fragment>
          <span
            style={{
              color:
                appConfigStatusColorMap[`${detailData && detailData.accessStatus}`
]
            }}
          >
            {appConfigStatusMap[`${detailData && detailData.accessStatus}`]}
          </span>
          <AppErrorListModal
            appId={id}
            btnText={
              <img
                style={{ width: 16 }}
                src={require('./../../../assets/error_icon.png')}
              />
            }
          />
        </Fragment>
      )
    }
  ];

  return (
    <DetailHeader
      leftWrapData={leftData}
      rightWrapData={rightData}
      extra={
        <div className={styles.extraWrap}>
          {/* <Button onClick={handleRefresh}>刷新</Button> */}
          <ImportFileModal
            btnText="导入"
            id={id}
            visible={state.visible}
            onSuccess={() => {
              setState({
                isReload: !state.isReload
              });
            }}
            state={state}
            setState={setState}
          />
          <Button
            onClick={() => {
              setState({
                visible: true
              });
            }}
            type="primary"
          >
            导入
          </Button>
          <Button
            type="primary"
            ghost
            style={{ margin: '0px 24px' }}
            onClick={handleExport}
          >
            导出
          </Button>
          {
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <AuthorityBtn
                      isShow={
                        btnAuthority &&
                        btnAuthority.appManage_4_delete &&
                        detailData &&
                        detailData.canRemove
                      }
                    >
                      <Popconfirm
                        title="确定删除应用吗？"
                        onConfirm={() => handleDeleteApp(id)}
                        disabled={
                          state.switchStatus === 'OPENING' ||
                          state.switchStatus === 'CLOSING'
                            ? true
                            : false
                        }
                      >
                        <Button
                          disabled={
                            state.switchStatus === 'OPENING' ||
                            state.switchStatus === 'CLOSING'
                              ? true
                              : false
                          }
                          type="link"
                          style={{ marginRight: 8, borderColor: '' }}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    </AuthorityBtn>
                  </Menu.Item>
                  <Menu.Item>
                    <AuthorityBtn
                      isShow={
                        btnAuthority &&
                        btnAuthority.appManage_3_update &&
                        detailData &&
                        detailData.canEdit
                      }
                    >
                      <AddAppDrawer
                        action="edit"
                        titles="编辑"
                        id={id}
                        disabled={
                          state.switchStatus === 'OPENING' ||
                          state.switchStatus === 'CLOSING'
                            ? true
                            : false
                        }
                        onSccuess={() => {
                          setState({
                            isReload: !state.isReload
                          });
                        }}
                      />
                    </AuthorityBtn>
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <Icon type="more" />
            </Dropdown>
          }
        </div>}
    />
  );
};
export default AppDetailHeader;
