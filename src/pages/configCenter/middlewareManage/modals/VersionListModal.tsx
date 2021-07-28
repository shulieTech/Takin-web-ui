import React, { Fragment, useEffect } from 'react';
import { CommonModal, useStateReducer } from 'racc';
import { ColumnProps } from 'antd/lib/table';
import { Badge, Divider, Pagination, Popover, Tag } from 'antd';
import { customColumnProps } from 'src/components/custom-table/utils';
import CustomTable from 'src/components/custom-table';
import styles from './../index.less';
import MiddlewareManageService from '../service';
import TableIndex from 'src/common/table-index/TableIndex';
import EditMiddlewareModal from './EditMiddlewareModal';
import moment from 'moment';
import { middlewareStatusColorMap, middlewareStatusMap } from '../enum';
import AuthorityBtn from 'src/common/authority-btn/AuthorityBtn';
interface Props {
  btnText?: string | React.ReactNode;
  appId?: number | string;
  artifactId: string;
  groupId: string;
}
const getInitState = () => ({
  loading: false,
  dataSource: null,
  searchParams: {
    current: 0,
    pageSize: 10
  },
  total: 0
});

type State = ReturnType<typeof getInitState>;
const VersionListModal: React.FC<Props> = props => {
  const [state, setState] = useStateReducer<State>(getInitState());
  const { artifactId, groupId } = props;

  const handleClick = () => {
    queryVersionList({ ...state.searchParams });
  };

  /**
   * @name 获取版本详情
   */
  const queryVersionList = async value => {
    const {
      total,
      data: { success, data }
    } = await MiddlewareManageService.queryMiddlewareList({
      groupId,
      artifactId,
      ...value
    });
    if (success) {
      setState({
        total,
        dataSource: data
      });
    }
  };

  const getColumns = (): ColumnProps<any>[] => {
    return [
      {
        ...customColumnProps,
        title: 'ID',
        dataIndex: 'id',
        render: text => {
          return <TableIndex text={text} />;
        }
      },
      {
        ...customColumnProps,
        title: '版本号',
        dataIndex: 'version',
        render: text => {
          return <Tag>{text}</Tag>;
        }
      },
      {
        ...customColumnProps,
        title: '状态',
        dataIndex: 'status',
        render: text => {
          return (
            <Badge
              text={middlewareStatusMap[text]}
              color={middlewareStatusColorMap[text]}
            />
          );
        }
      },
      {
        ...customColumnProps,
        title: '最后更新时间',
        dataIndex: 'gmtUpdate',
        render: text => moment(text).format('YYYY-MM-DD HH:mm:ss') || '-'
      },
      {
        ...customColumnProps,
        title: '操作',
        dataIndex: 'action',
        render: (text, row) => {
          return (
            <AuthorityBtn isShow={row.canEdit}>
              <EditMiddlewareModal
                type="2"
                btnText="编辑"
                details={row}
                id={row.id}
                onSuccess={() => {
                  queryVersionList({ ...state.searchParams });
                }}
              />
            </AuthorityBtn>
            
          );
        }
      }
    ];
  };

  const handleChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: current - 1
      }
    });
    queryVersionList({ pageSize, current: current - 1 });
  };

  const handlePageSizeChange = async (current, pageSize) => {
    setState({
      searchParams: {
        pageSize,
        current: 0
      }
    });
    queryVersionList({ pageSize, current: 0 });
  };

  return (
    <CommonModal
      modalProps={{
        width: 800,
        footer: null,
        title: '版本详情'
      }}
      btnProps={{ type: 'link' }}
      btnText={props.btnText}
      onClick={() => handleClick()}
    >
      <div style={{ height: 500 }}>
        <CustomTable
          rowKey={(row, index) => index.toString()}
          columns={getColumns()}
          size="small"
          dataSource={state.dataSource || []}
          scroll={{ y: 400 }}
        />
        <Pagination
          style={{
            marginTop: 20,
            textAlign: 'right',
            position: 'absolute',
            bottom: 0,
            right: 0
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
          onChange={(current, pageSize) => handleChange(current, pageSize)}
          onShowSizeChange={handlePageSizeChange}
        />
      </div>
    </CommonModal>
  );
};
export default VersionListModal;
