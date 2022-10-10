import React, { useState, useEffect, useContext } from 'react';
import {
  Alert,
  Divider,
  Icon,
  Button,
  Tooltip,
  Modal,
  Radio,
  message,
  Upload,
} from 'antd';
import { PrepareContext } from '../_layout';
import DataIsolateGuide from './DataIsolateGuide';
import DataSourceMode from './DataSourceMode';
import AppMode from './AppMode';
import EditDataSource from '../modals/EditDataSource';
import service from '../service';
import styles from '../index.less';
import { getUrl } from 'src/utils/request';
import { ISOLATE_TYPE } from '../constants';
import AddDynamicDbDrawer from 'src/pages/appManage/components/AddDynamicDbDrawer';

export default (props) => {
  const { prepareState, setPrepareState } = useContext(PrepareContext);
  const showGuide = !prepareState.currentLink?.isolateType;
  const [mode, setMode] = useState(0);
  const [editedDataSource, setEditedDataSource] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [isolateListRefreshKey, setIsolateListRefreshKey] = useState(0);
  const [helpInfoKey, setHelpInfoKey] = useState(0);
  const freshIsoloateHelpInfo = () => setHelpInfoKey(helpInfoKey + 1);

  const setIsolateType = () => {
    let val = prepareState?.currentLink?.isolateType;
    Modal.confirm({
      className: styles['modal-tight'],
      width: 640,
      icon: null,
      content: (
        <div>
          <div
            style={{
              fontSize: 20,
              color: 'var(--Netural-990, #25282A)',
              borderBottom: '1px solid var(--Netural-100, #EEF0F2)',
              paddingBottom: 30,
              lineHeight: 1,
            }}
          >
            设置隔离方案
          </div>
          <div style={{ padding: 24 }}>
            <Radio.Group
              defaultValue={val}
              onChange={(e) => (val = e.target.value)}
            >
              {Object.entries(ISOLATE_TYPE).map(([x, y]) => (
                <Radio value={+x} key={x}>
                  {y}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      ),
      okText: '确认设置',
      onOk: async () => {
        if (!val) {
          message.warn('请选择隔离方案');
          return Promise.reject();
        }
        const {
          data: { success },
        } = await service.setIsolateType({
          id: prepareState?.currentLink?.id,
          isolateType: val,
        });
        if (success) {
          message.success('操作成功');
          setPrepareState({
            refreshListKey: prepareState.refreshListKey + 1,
          });
          setIsolateListRefreshKey(isolateListRefreshKey + 1);
        } else {
          return Promise.reject();
        }
      },
    });
  };

  const activeModeSwitchStyle = {
    backgroundColor: 'var(--Netural-100, #EEF0F2)',
  };

  const uploadFile = async ({ file }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceId', prepareState.currentLink.id);

    const {
      data: { success },
    } = await service.importConfigFile(formData).finally(() => {
      setUploading(false);
    });
    if (success) {
      message.success('操作成功');
      setIsolateListRefreshKey(isolateListRefreshKey + 1);
    }
  };

  const downLoadConfigFile = () => {
    window.location.href = getUrl(
      `/pressureResource/ds/export?resourceId=${prepareState.currentLink.id}`
    );
  };
  
  // 获取数据源统计信息
  const getDataSourceSummaryInfo = async (id) => {
    const {
      data: { success, data },
    } = await service.dataSourceSummaryInfo({ id });
    if (success) {
      setPrepareState({
        helpInfo: {
          show: true,
          text: (
            <>
              {data.totalSize > 0 ? (
                <span>
                  识别数据源：<b>{data.totalSize}</b>
                </span>
              ) : (
                '暂无数据源'
              )}
              {data.normalSize > 0 && (
                <span style={{ marginLeft: 32 }}>
                  正常： <b>{data.normalSize}</b>
                </span>
              )}
              {data.exceptionSize > 0 && (
                <span
                  style={{
                    marginLeft: 32,
                  }}
                >
                  异常：
                  <b style={{ color: 'var(--FunctionNegative-500, #D24D40)' }}>
                    {data.exceptionSize}
                  </b>
                </span>
              )}
            </>
          ),
          checkTime: data.checkTime,
          userName: data.userName,
        },
      });
    }
  };

  useEffect(() => {
    getDataSourceSummaryInfo(prepareState.currentLink.id);
  }, [helpInfoKey]);

  if (showGuide) {
    return <DataIsolateGuide setIsolateType={setIsolateType} />;
  }

  return (
    <>
      <div
        style={{
          padding: '16px 32px',
          borderBottom: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              padding: 4,
              border: '1px solid var(--Netural-100, #EEF0F2)',
              borderRadius: 100,
              display: 'inline-block',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                lineHeight: '32px',
                padding: '0 16px',
                borderRadius: 100,
                color: 'var(--Netural/800, #5A5E62)',
                fontWeight: 500,
                cursor: 'pointer',
                ...(mode === 0 ? activeModeSwitchStyle : {}),
              }}
              onClick={() => setMode(0)}
            >
              数据源模式
            </div>
            <div
              style={{
                display: 'inline-block',
                lineHeight: '32px',
                padding: '0 16px',
                borderRadius: 100,
                color: 'var(--Netural/800, #5A5E62)',
                fontWeight: 500,
                cursor: 'pointer',
                ...(mode === 1 ? activeModeSwitchStyle : {}),
              }}
              onClick={() => setMode(1)}
            >
              应用模式
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            隔离方式：
            {ISOLATE_TYPE[prepareState?.currentLink?.isolateType] || '-'}
            <a style={{ marginLeft: 16 }} onClick={setIsolateType}>
              设置
            </a>
          </div>
          <Divider type="vertical" style={{ height: 24, margin: '0 24px' }} />
          {/* <Tooltip title="数据库连接地址">
            <Icon type="info-circle" style={{ cursor: 'pointer' }} />
          </Tooltip>
          <Button
            style={{ marginLeft: 24 }}
            onClick={() => setEditedDataSource({})}
          >
            新增数据源
          </Button> */}
          <AddDynamicDbDrawer
            titles="新增数据源"
            action="add"
            detailData={{
              dsType: { 1: '0', 2: '2', 3: '1' }[prepareState?.currentLink?.isolateType]
            }}
            onSuccess={() => {
              // TODO 刷新
            }}
          />
          <Upload
            accept=".xlsx,.csv,.xls"
            showUploadList={false}
            customRequest={uploadFile}
          >
            <Button loading={uploading} style={{ marginLeft: 16 }}>导入隔离配置</Button>
          </Upload>
          <Button
            type="primary"
            style={{ marginLeft: 24 }}
            onClick={downLoadConfigFile}
          >
            导出待配置项
          </Button>
        </div>
      </div>
      {mode === 0 && (
        <DataSourceMode
          setEditedDataSource={setEditedDataSource}
          isolateListRefreshKey={isolateListRefreshKey}
          freshIsoloateHelpInfo={freshIsoloateHelpInfo}
        />
      )}
      {mode === 1 && <AppMode isolateListRefreshKey={isolateListRefreshKey} />}
      {editedDataSource && (
        <EditDataSource
          detail={editedDataSource}
          okCallback={() => {
            setEditedDataSource(undefined);
            setIsolateListRefreshKey(isolateListRefreshKey + 1);
          }}
          cancelCallback={() => setEditedDataSource(undefined)}
        />
      )}
    </>
  );
};
