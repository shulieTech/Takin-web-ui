/**
 * @author chuxu
 */
import React, { Fragment, useContext, useEffect } from 'react';
import { MiddlewareManageContext } from '../indexPage';
import MiddlewareManageService from '../service';
import { Button, Col, Icon, Pagination, Row } from 'antd';
import Search from 'antd/lib/input/Search';
import { CommonSelect, ImportFile } from 'racc';
import CustomTable from 'src/components/custom-table';
import getMiddlewareManageColumns from './MiddlewareManageColumns';
import EmptyNode from 'src/common/empty-node/EmptyNode';
import ImportFileModal from 'src/common/import-file-modal/ImportFileModal';
import { connect } from 'dva';
import styles from './../index.less';
interface Props {
  dictionaryMap?: any;
}
declare var serverUrl;
const MiddlewareManageSearchAndTable: React.FC<Props> = props => {
  const { state, setState } = useContext(MiddlewareManageContext);
  const { fileModalValues } = state;

  const { dictionaryMap } = props;
  const { MIDDLEWARE_STATUS } = dictionaryMap;

  useEffect(() => {
    queryMiddlewareSummaryList({
      ...state.searchParams,
      status: state.status,
      q: state.searchInputValue
    });
  }, [
    state.isReload,
    state.status,
    state.searchParams.current,
    state.searchParams.pageSize
  ]);

  /**
   * @name 获取中间件汇总列表
   */
  const queryMiddlewareSummaryList = async value => {
    setState({
      loading: true
    });
    const {
      total,
      data: { success, data }
    } = await MiddlewareManageService.queryMiddlewareSummaryList({
      ...value
    });
    if (success) {
      setState({
        total,
        middlewareSummaryDataSource: data,
        loading: false
      });
      return;
    }
    setState({
      loading: false
    });
  };

  const handleChangePage = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
  };

  const handleChangeStatus = async value => {
    setState({
      status: value,
      searchParams: {
        pageSize: state.searchParams.pageSize,
        current: 0
      }
    });
  };

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

  const handleUpload = value => {
    setState({
      fileName: value.file.name
    });
  };

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100%)',
        // border: '1px solid purple',
        overflow: 'scroll'
      }}
    >
      <Row
        type="flex"
        justify="space-between"
        align="middle"
        style={{ marginBottom: 20, marginTop: 20 }}
      >
        <Col span={6}>
          <Search
            placeholder="搜索Artifact ID、Group ID"
            enterButton
            onSearch={() =>
              setState({
                isReload: !state.isReload,
                searchParams: {
                  pageSize: state.searchParams.pageSize,
                  current: 0
                }
              })
            }
            onChange={e =>
              setState({
                searchInputValue: e.target.value
              })
            }
            value={state.searchInputValue}
          />
        </Col>
        <Col>
          <Button
            type="link"
            style={{ marginRight: 16 }}
            onClick={() => {
              setState({
                searchInputValue: null,
                status: undefined,
                isReload: !state.isReload,
                searchParams: {
                  current: 0,
                  pageSize: 10
                }
              });
            }}
          >
            重置
          </Button>
          <CommonSelect
            placeholder="状态:全部"
            style={{ width: 140, marginRight: 16 }}
            dataSource={MIDDLEWARE_STATUS || []}
            onChange={handleChangeStatus}
            value={state.status}
          />
          <Icon
            onClick={() => {
              setState({
                searchInputValue: null,
                isReload: !state.isReload,
                searchParams: {
                  current: 0,
                  pageSize: 10
                }
              });
            }}
            type="redo"
          />
        </Col>
      </Row>
      <div>
        {
          <ImportFileModal
            onCancel={() => {
              setState({
                visible: false,
                fileModalValues: {
                  fileTitle: null,
                  status: null,
                  footerTxt: null,
                  extraNode: null,
                  footerBtnTxt: null
                }
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
              setState({
                visible: false,
                fileModalValues: {
                  fileTitle: null,
                  status: null,
                  footerTxt: null,
                  extraNode: null,
                  footerBtnTxt: null
                }
              });
            }}
          />
        }
      </div>
      {!state.middlewareSummaryDataSource ||
      state.middlewareSummaryDataSource.length === 0 ? (
        <div>
          <EmptyNode
            title="暂无数据,请先导入"
            desc="暂无中间件数据，您可点击「导入」按钮，进行中间件库数据更新"
            extra={
              <ImportFile
                accept={['xlsx', 'csv', 'xls']}
                UploadProps={{
                  multiple: false,
                  onChange: handleUpload
                }}
                fileName="file"
                onImport={file => handleImportFile(file)}
              >
                <Button style={{ marginTop: 16 }}>导入中间件</Button>
              </ImportFile>
            }
          />
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            height: 'calc(100% - 75px)',
            overflow: 'scroll'
          }}
        >
          <div
            style={{
              position: 'relative',
              height: 'calc(100% - 30px)',
              overflow: 'scroll'
            }}
          >
            <CustomTable
              rowKey={(row, index) => index.toString()}
              loading={state.loading}
              columns={getMiddlewareManageColumns(state, setState)}
              dataSource={state.middlewareSummaryDataSource || []}
              style={{ paddingBottom: 30 }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              padding: '8px 16px',
              bottom: 0,
              right: 0,
              width: '100%',
              background: '#fff'
            }}
          >
            <Pagination
              style={{
                float: 'right'
              }}
              total={state.total}
              current={state.searchParams.current + 1}
              pageSize={state.searchParams.pageSize}
              showTotal={(t, range) =>
                `共 ${state.total} 条数据 第${state.searchParams.current +
                  1}页 / 共 ${Math.ceil(
                  state.total / (state.searchParams.pageSize || 10)
                )}页`
              }
              showSizeChanger={true}
              onChange={(current, pageSize) =>
                handleChangePage(current, pageSize)
              }
              onShowSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default connect(({ common }) => ({ ...common }))(
  MiddlewareManageSearchAndTable
);
