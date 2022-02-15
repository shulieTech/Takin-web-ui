/**
 * @author chuxu
 */
import { Button, Col, Row, Upload } from 'antd';
import { ImportFile, useCreateContext, useStateReducer } from 'racc';
import React, { Fragment } from 'react';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
import CustomDetailHeader from 'src/common/custom-detail-header.tsx';
import CustomIcon from 'src/common/custom-icon/CustomIcon';
import { MainPageLayout } from 'src/components/page-layout';
import request from 'src/utils/request';
import { isEmpty, MapBtnAuthority } from 'src/utils/utils';
import commonStyles from '../../../../custom.less';
import MiddlewareManageBottom from './components/MiddlewareManageBottom';
import styles from './index.less';
import MiddlewareManageService from './service';
declare var serverUrl: string;
interface Props {}
const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  middlewareDashboard: {} as any,
  searchInputValue: null,
  status: undefined,
  loading: false,
  total: 0,
  visible: false,
  middlewareSummaryDataSource: null,
  fileName: null,
  fileModalValues: {
    fileTitle: null,
    status: null,
    footerTxt: null,
    footerBtnTxt: null,
    extraNode: null
  },
  uploadFileList: []
});
export const MiddlewareManageContext = useCreateContext<
  MiddlewareManageState
>();
export type MiddlewareManageState = ReturnType<typeof getInitState>;
const MiddlewareManage: React.FC<Props> = props => {
  const [state, setState] = useStateReducer(getInitState());

  /**
   * @name 导出
   */
  const handleExport = async () => {
    downloadFile('中间件库概况.xlsx');
  };

  /**
   * @name 导入中间件
   */
  const handleImportFile = async file => {
    setState({
      visible: true,
      fileModalValues: {
        ...state.fileModalValues,
        fileTitle: '导入文件',
        status: 'loading',
        footerTxt: '文件导入中，请稍后...'
      }
    });
    const {
      data: { success, data }
    } = await MiddlewareManageService.importMiddleware(file);

    if (success) {
      setState({
        fileModalValues: {
          ...state.fileModalValues,
          fileTitle: '导入文件',
          status: data.fail > 0 ? 'fail' : 'success',
          footerBtnTxt: '完成',
          footerTxt: '请在下载文件中查看明细',
          extraNode: (
            <p className={styles.desc}>
              {data.fail > 0 ? '部分导入失败，本次成功导入 ' : '本次成功导入 '}
              <span className={styles.successColor}>{data.success}</span> 条
              {data.fail > 0 && (
                <span>
                  ，失败 <span className={styles.errorColor}>{data.fail}</span>{' '}
                  条
                </span>
              )}
            </p>
          )
        }
      });
      location.href = `${serverUrl}${data.url}`;
      return;
    }

    setState({
      fileModalValues: {
        ...state.fileModalValues,
        fileTitle: '导入文件',
        status: 'fail',
        footerBtnTxt: '完成'
      }
    });
  };
  /**
   * @name 比对
   */
  const handleCompare = async info => {
    /**
     * @name 准备上传的文件列表
     */
    const readyToUploadFileList =
      info.fileList &&
      info.fileList.slice(state.uploadFileList && state.uploadFileList.length);
    setState({
      fileName:
        info.fileList &&
        info.fileList.slice(
          state.uploadFileList && state.uploadFileList.length
        ) &&
        info.fileList
          .slice(state.uploadFileList && state.uploadFileList.length)
          .map(item => {
            return item.name;
          })
    });
    const formData = new FormData();
    readyToUploadFileList.map(item => {
      formData.append('files', item.originFileObj);
    });
    if (info.file.uid === info.fileList.slice(-1)[0].uid && formData) {
      uploadFilesApi(formData, info.fileList);
    }
  };

  const uploadFilesApi = async (files, fileList) => {
    setState({
      visible: true,
      fileModalValues: {
        ...state.fileModalValues,
        fileTitle: '中间件比对',
        status: 'loading',
        footerTxt: '文件比对中，请稍后...'
      }
    });
    const {
      data: { success, data }
    } = await MiddlewareManageService.compareMiddleware(files);
    if (success) {
      setState({
        uploadFileList: fileList,
        fileModalValues: {
          ...state.fileModalValues,
          fileTitle: '中间件比对',
          status: 'success',
          footerBtnTxt: '完成',
          footerTxt: '请在下载文件中查看明细',
          extraNode:
            data.notSupported > 0 || data.unknown > 0 ? (
              <p className={styles.desc}>
                比对成功，发现中间件「 未支持 」
                <span className={styles.errorColor}>{data.notSupported}</span>{' '}
                条，「 未知 」
                <span className={styles.errorColor}>{data.unknown}</span> 条
              </p>
            ) : (
              <p className={styles.desc}>
                比对成功，未发现「未支持」或「未知」中间件
              </p>
            )
        }
      });
      location.href = `${serverUrl}${data.url}`;
      return;
    }
    setState({
      uploadFileList: fileList,
      fileModalValues: {
        ...state.fileModalValues,
        fileTitle: '中间件比对',
        status: 'fail',
        footerBtnTxt: '完成'
      }
    });
  };

  const handleUpload = value => {
    setState({
      fileName: value.file.name
    });
  };

  const downloadFile = async fileName => {
    const { data, status, headers } = await request({
      url: `${serverUrl}/application/middlewareSummary/export`,
      responseType: 'blob',
      headers: {
        'x-token': localStorage.getItem('full-link-token'),
        'Auth-Cookie': localStorage.getItem('auth-cookie'),
        'tenant-code': localStorage.getItem('tenant-code'),
        'env-code': localStorage.getItem('env-code'),
      },
      params: {
        status: state.status,
        q: state.searchInputValue
      }
    });
    const blob = new Blob([data], {
      type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;`
    });

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

  return (
    <MiddlewareManageContext.Provider value={{ state, setState }}>
      <MainPageLayout>
        <div className={styles.borders}>
          <CustomDetailHeader
            title="中间件库管理"
            img={
              <CustomIcon
                imgWidth={28}
                color="var(--BrandPrimary-500, #11D0C5)"
                imgName="redis_icon"
                iconWidth={64}
              />
            }
            // description="中间件库管理相关说明"
            extra={
              <div style={{ float: 'right' }}>
                <Button onClick={handleExport}>导出</Button>
                <AuthorityBtn
                  isShow={MapBtnAuthority(
                    'configCenter_middlewareManage_3_update'
                  )}
                >
                  <ImportFile
                    accept={['xlsx', 'csv', 'xls']}
                    UploadProps={{
                      multiple: false,
                      onChange: handleUpload
                    }}
                    fileName="file"
                    onImport={file => handleImportFile(file)}
                  >
                    <Button style={{ marginLeft: 16 }}>导入中间件</Button>
                  </ImportFile>
                </AuthorityBtn>

                <Upload
                  accept=".xlsx,.csv,.xls"
                  multiple={true}
                  onChange={info => {
                    handleCompare(info);
                  }}
                  beforeUpload={() => {
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button type="primary" style={{ marginLeft: 16 }}>
                    比对
                  </Button>
                </Upload>
              </div>}
          />
        </div>
        <MiddlewareManageBottom />
      </MainPageLayout>
    </MiddlewareManageContext.Provider>
  );
};
export default MiddlewareManage;
