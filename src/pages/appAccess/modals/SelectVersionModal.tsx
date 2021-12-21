import React, { Fragment, useContext, useEffect } from 'react';
import { CommonModal, CommonSelect, CommonTable, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Button, Col, Icon, Pagination, Row, Typography } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import AppAccessService from '../service';
import TableTwoRows from 'src/common/table-two-rows/TableTwoRows';
import TableIndex from 'src/common/table-index/TableIndex';
import { AppAccessContext } from '../indexPage';
interface Props {
  btnText?: string | React.ReactNode;
  agentId: number | string;
  selectedVersionInfo: any;
  state: any;
  setState: (value: any) => void;
}
const { Paragraph } = Typography;

const getInitState = () => ({
  isReload: false,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  data: null,
  total: 0,
  status: undefined,
  allVersionList: null,
  selectedRowKeys: null,
  selectedVersionInfo: null
});
export type SelectVersionState = ReturnType<typeof getInitState>;
const SelectVersionModal: React.FC<Props> = props => {
  const [modalState, setModalState] = useStateReducer(getInitState());
  const { state, setState } = props;

  const handleClick = () => {
    queryAllVersionList();
    queryVersionList({
      ...modalState.searchParams,
      version: modalState.status
    });

    setModalState({
      selectedRowKeys: props.agentId,
      selectedVersionInfo: props.selectedVersionInfo
    });
  };

  /**
   * @name 获取版本列表
   */
  const queryVersionList = async value => {
    const {
      total,
      data: { success, data }
    } = await AppAccessService.queryVersionList({
      ...value
    });
    if (success) {
      setModalState({
        data,
        total
      });
    }
  };

  /**
   * @name 获取全部版本号
   */
  const queryAllVersionList = async () => {
    const {
      data: { success, data }
    } = await AppAccessService.queryAllVersionList({});
    if (success) {
      setModalState({
        allVersionList:
          data &&
          data.map((item, k) => {
            return { label: item, value: item };
          })
      });
    }
  };

  const handleChangeStatus = value => {
    setModalState({
      status: value,
      searchParams: {
        current: 0,
        pageSize: modalState.searchParams.pageSize
      }
    });
    queryVersionList({
      ...modalState.searchParams,
      version: value,
      current: 0
    });
  };

  const handleChange = async (current, pageSize) => {
    setModalState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
    queryVersionList({
      pageSize,
      version: modalState.status,
      current: current - 1
    });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setModalState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryVersionList({
      pageSize,
      version: modalState.status,
      current: 0
    });
  };

  const handleSubmit = async () => {
    return await new Promise(async resolve => {
      setState({
        selectedRowKeys: modalState.selectedRowKeys,
        agentVersionInfo: modalState.selectedVersionInfo
      });
      setModalState({
        status: undefined,
        searchParams: {
          current: 0,
          pageSize: 10
        }
      });
      resolve(true);
    });
  };

  const handleCancle = () => {
    setModalState({
      selectedRowKeys: null,
      selectedVersionInfo: null,
      status: undefined,
      searchParams: {
        current: 0,
        pageSize: 10
      }
    });
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: '序号',
        dataIndex: 'id',
        render: text => {
          return <TableIndex text={text} />;
        }
      },
      {
        ...customColumnProps,
        title: '探针版本',
        dataIndex: 'version',
        width: 300,
        render: (text, row) => {
          return (
            <TableTwoRows
              title={`V ${text}`}
              secondLineContent={[
                {
                  label: '更新时间:',
                  value: row.gmtUpdate
                }
              ]}
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '版本特性',
        dataIndex: 'versionFeatures',
        width: 500,
        render: text => {
          return (
            <Paragraph ellipsis={{ rows: 1, expandable: true }}>
              {text}
            </Paragraph>
          );
        }
      }
    ];
  };

  return (
    <CommonModal
      modalProps={{
        width: 960,
        title: '选择版本',
        maskClosable: false
      }}
      btnText={props.btnText}
      onClick={() => handleClick()}
      beforeOk={handleSubmit}
      afterCancel={handleCancle}
    >
      <div style={{ minHeight: 500 }}>
        <Row
          type="flex"
          align="middle"
          justify="end"
          style={{ marginBottom: 20 }}
        >
          <Col>
            <Button
              type="link"
              style={{ marginRight: 16 }}
              onClick={() => {
                setModalState({
                  status: undefined,
                  searchParams: {
                    current: 0,
                    pageSize: 10
                  }
                });
                queryVersionList({
                  pageSize: 10,
                  version: undefined,
                  current: 0
                });
              }}
            >
              重置
            </Button>
            <CommonSelect
              placeholder="探针版本号:全部"
              style={{ width: 160, marginRight: 16 }}
              dataSource={modalState.allVersionList || []}
              onChange={handleChangeStatus}
              value={modalState.status}
              showSearch
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            />
            <Icon
              onClick={() => {
                setModalState({
                  isReload: !modalState.isReload,
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
        <CustomTable
          scroll={{ y: 400 }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: Array.isArray(modalState.selectedRowKeys) ?
            modalState.selectedRowKeys : [modalState.selectedRowKeys],
            onChange: (selectedRowKeys, selectedRows) => {
              setModalState({
                selectedRowKeys,
                selectedVersionInfo: selectedRows[0]
              });
            }
          }}
          rowKey="id"
          columns={getColumns()}
          size="small"
          dataSource={modalState.data ? modalState.data : []}
        />
      </div>
      <Pagination
        style={{ marginTop: 20, textAlign: 'right' }}
        total={modalState.total}
        current={modalState.searchParams.current + 1}
        pageSize={modalState.searchParams.pageSize}
        showTotal={(t, range) =>
          `共 ${modalState.total} 条数据 第${modalState.searchParams.current +
            1}页 / 共 ${Math.ceil(
            modalState.total / (modalState.searchParams.pageSize || 10)
          )}页`
        }
        showSizeChanger={true}
        onChange={(current, pageSize) => handleChange(current, pageSize)}
        onShowSizeChange={handlePageSizeChange}
      />
    </CommonModal>
  );
};
export default SelectVersionModal;
